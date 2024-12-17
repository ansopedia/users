import { ErrorTypeEnum, ROLES } from "@/constants";
import { generateRandomUsername, validateObjectId } from "@/utils";

import { RoleDAL } from "../role/role.dal";
import { UserRoleService } from "../userRole/user-role.service";
import { UserDAL } from "./user.dal";
import { UserDto } from "./user.dto";
import {
  CreateUser,
  Email,
  GetUser,
  UpdateUser,
  validateCreateUser,
  validateEmail,
  validateUsername,
} from "./user.validation";

export class UserService {
  static async generateUniqueUsername(username: string): Promise<string> {
    const user = await UserDAL.getUserByUsername(username);

    if (!user) return username;

    const newUsername = generateRandomUsername();

    return await this.generateUniqueUsername(newUsername);
  }

  static async createUser(userData: CreateUser): Promise<GetUser> {
    validateCreateUser(userData);

    const isUserExist = await UserDAL.getUserByEmail(userData.email);

    if (isUserExist) throw new Error(ErrorTypeEnum.enum.EMAIL_ALREADY_EXISTS);

    const isUserNameExist = await UserDAL.getUserByUsername(userData.username);

    if (isUserNameExist) throw new Error(ErrorTypeEnum.enum.USER_NAME_ALREADY_EXISTS);

    const createdUser = await UserDAL.createUser(userData);

    const userRole = await RoleDAL.getRoleByName(ROLES.USER);

    if (!userRole) throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);

    await UserRoleService.createUserRole({
      userId: createdUser.id,
      roleId: userRole.id,
    });

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
    const validateData = validateObjectId(userId);

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
    validateEmail(email);

    const user = await UserDAL.getUserByEmail(email);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async softDeleteUser(userId: string): Promise<GetUser> {
    const validateData = validateObjectId(userId);

    const user = await UserDAL.softDeleteUser(validateData);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async restoreUser(userId: string): Promise<GetUser> {
    const validateData = validateObjectId(userId);

    const user = await UserDAL.restoreUser(validateData);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    return UserDto(user).getUser();
  }

  static async updateUser(userId: string, userData: UpdateUser): Promise<GetUser> {
    validateObjectId(userId);

    const updatedUser = await UserDAL.updateUser(userId, userData);

    if (!updatedUser) throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);

    return UserDto(updatedUser).getUser();
  }
}
