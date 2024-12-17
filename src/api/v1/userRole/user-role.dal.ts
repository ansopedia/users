import { UserRoleModel } from "./user-role.model";
import { UserRole } from "./user-role.validation";

export class UserRoleDAL {
  static async createUserRole(userRole: UserRole) {
    const rolePermission = await UserRoleModel.create(userRole);
    return rolePermission.save();
  }

  static async getUserRoles(userId: string) {
    return await UserRoleModel.find({ userId });
  }

  static async exists(userRole: UserRole) {
    return await UserRoleModel.exists(userRole);
  }
}
