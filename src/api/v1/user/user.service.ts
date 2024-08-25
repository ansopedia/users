import { UserDAL } from './user.dal';
import { UserDto } from './user.dto';
import {
  CreateUser,
  createUserSchema,
  Email,
  GetUser,
  UpdateUser,
  validateEmail,
  validateUsername,
} from './user.validation';
import { RoleService } from '../role/role.service';
import { UserRoleService } from '../userRole/user-role.service';
import { generateRandomUsername, validateMongoId } from '@/utils';
import { ErrorTypeEnum, ROLES } from '@/constants';

export class UserService {
  static async generateUniqueUsername(username: string): Promise<string> {
    const user = await UserDAL.getUserByUsername(username);

    if (!user) return username;

    const newUsername = generateRandomUsername();

    return await this.generateUniqueUsername(newUsername);
  }

  static async createUser(userData: CreateUser): Promise<GetUser> {
    const validUserData = createUserSchema.parse(userData);

    const isUserExist = await UserDAL.getUserByEmail(validUserData.email);

    if (isUserExist) throw new Error(ErrorTypeEnum.enum.EMAIL_ALREADY_EXISTS);

    const isUserNameExist = await UserDAL.getUserByUsername(validUserData.username);

    if (isUserNameExist) throw new Error(ErrorTypeEnum.enum.USER_NAME_ALREADY_EXISTS);

    const createdUser = await UserDAL.createUser(validUserData);

    const userRole = await RoleService.getRoleByName(ROLES.USER);

    await UserRoleService.createUserRole({ userId: createdUser.id, roleId: userRole.id });

    return UserDto(createdUser).getUser();
  }

  static async getAllUsers(): Promise<GetUser[]> {
    const users = await UserDAL.getAllUsers();
    return users.map((user) => UserDto(user).getUser());
  }

  static async getUserByUsername(username: string): Promise<GetUser> {
    const validateData = validateUsername.parse({ username });

    const user = await UserDAL.getUserByUsername(validateData.username);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async getUserById(userId: string): Promise<GetUser> {
    const validateData = validateMongoId.parse(userId);

    const user = await UserDAL.getUserById(validateData);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async getUserByGoogleId(googleId: string): Promise<GetUser | null> {
    const user = await UserDAL.getUserByGoogleId(googleId);

    if (user) return UserDto(user).getUser();

    return null;
  }

  static async getUserByEmail(email: Email): Promise<GetUser> {
    const validEmail = validateEmail.parse(email);

    const user = await UserDAL.getUserByEmail(validEmail);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async softDeleteUser(userId: string): Promise<GetUser> {
    const validateData = validateMongoId.parse(userId);

    const user = await UserDAL.softDeleteUser(validateData);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async restoreUser(userId: string): Promise<GetUser> {
    const validateData = validateMongoId.parse(userId);

    const user = await UserDAL.restoreUser(validateData);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async updateUser(userId: string, userData: UpdateUser): Promise<GetUser> {
    const validateData = validateMongoId.parse(userId);

    const user = await UserDAL.getUserById(validateData);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    const updatedUser = await UserDAL.updateUser(validateData, userData);

    if (!updatedUser) throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);

    return UserDto(updatedUser).getUser();
  }
}
