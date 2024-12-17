import { RoleModel } from "./role.model";
import { Role, createRole } from "./role.validation";

export class RoleDAL {
  static async createRole(userData: createRole): Promise<Role> {
    const newRole = new RoleModel({
      ...userData,
      updatedBy: userData.createdBy,
    });
    return await newRole.save();
  }

  static async createRoles(roles: createRole[]): Promise<Role[]> {
    return await RoleModel.insertMany(roles.map((role) => ({ ...role, updatedBy: role.createdBy })));
  }

  static async getRoles(): Promise<Role[]> {
    return await RoleModel.find({ isDeleted: false });
  }

  static async getRoleByName(name: string): Promise<Role | null> {
    return await RoleModel.findOne({ name });
  }

  static async softDeleteRole(roleId: string): Promise<Role | null> {
    return await RoleModel.findByIdAndUpdate(roleId, { isDeleted: true }, { new: true });
  }

  static async restoreRole(roleId: string): Promise<Role | null> {
    return await RoleModel.findByIdAndUpdate(roleId, { isDeleted: false }, { new: true });
  }
}
