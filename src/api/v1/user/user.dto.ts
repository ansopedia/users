import { GetUser, User } from "./user.validation";

export const UserDto = (user: User) => ({
  getUser: (): GetUser => {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      isEmailVerified: user.isEmailVerified,
    };
  },
  createUser: () => {
    return {
      username: user.username,
      email: user.email,
      password: user.password,
    };
  },
  updateUser: () => {
    return {
      username: user.username,
      email: user.email,
      password: user.password,
    };
  },
  deleteUser: () => {
    return {
      username: user.username,
      email: user.email,
    };
  },
});
