import { ErrorTypeEnum } from '../../../constants/errorTypes.constant';
import { comparePassword } from '../../../utils/password.util';
import { UserDAL } from '../user/user.dal';
import { UserService } from '../user/user.service';
import { CreateUser, User } from '../user/user.validation';
import { AuthDAL } from './auth.dal';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwt.util';
import { loginSchema, Login, AuthToken } from './auth.validation';

export class AuthService {
  public static async signUp(userData: CreateUser) {
    await UserService.createUser(userData);

    // TODO: Send verification email
  }

  public static async signInWithEmailAndPassword(userData: Login): Promise<AuthToken> {
    const validUserData = loginSchema.parse(userData);

    const user = await UserDAL.getUserByEmail(validUserData.email);

    if (!user) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    const isPasswordMatch = await comparePassword(validUserData.password, user.password);

    if (!isPasswordMatch) throw new Error(ErrorTypeEnum.enum.INVALID_CREDENTIALS);

    if (user.isDeleted) throw new Error(ErrorTypeEnum.enum.USER_NOT_FOUND);

    const userId = user.id;

    const refreshToken = generateRefreshToken({ userId });
    const accessToken = generateAccessToken({ userId });

    const newAuthToken = await AuthDAL.updateAuthTokens({ userId, refreshToken });

    if (!newAuthToken) await AuthDAL.createAuth({ userId, refreshToken });

    return { userId, accessToken, refreshToken };
  }

  public static async signOut(userId: string) {
    return await AuthDAL.deleteAuth(userId);
  }

  public static async renewToken({ id: userId }: User): Promise<AuthToken> {
    const newRefreshToken = generateRefreshToken({ userId });
    const newAccessToken = generateAccessToken({ userId });

    await AuthDAL.updateAuthTokens({ userId, refreshToken: newRefreshToken });

    return { userId, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
