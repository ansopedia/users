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

  static async deleteUserRole(userId: string, roleId: string) {
    return await UserRoleModel.findOneAndDelete({ userId, roleId });
  }

  static async deleteUserRoles(userId: string) {
    return await UserRoleModel.deleteMany({ userId });
  }

  static async deleteRoleAssignments(roleId: string) {
    return await UserRoleModel.deleteMany({ roleId });
  }

  static async getUsersWithRole(roleId: string) {
    return await UserRoleModel.find({ roleId });
  }
}
