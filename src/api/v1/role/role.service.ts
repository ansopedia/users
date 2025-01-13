import { ErrorTypeEnum } from "@/constants";

import { validateObjectId } from "../../../utils/validation.util";
import { UserRoleDAL } from "../userRole/user-role.dal";
import { RoleDAL } from "./role.dal";
import { RoleDto } from "./role.dto";
import { createRole, createRoleSchema, getRole } from "./role.validation";

export class RoleService {
  static async createRole(roleData: createRole): Promise<getRole> {
    const validRoleData = createRoleSchema.parse(roleData);

    const isRoleExist = await RoleDAL.getRoleByName(validRoleData.name);

    if (isRoleExist) throw new Error(ErrorTypeEnum.enum.ROLE_ALREADY_EXISTS);

    const createdRole = await RoleDAL.createRole(validRoleData);

    return RoleDto(createdRole).getRole();
  }

  static async getRoles(): Promise<getRole[]> {
    const roles = await RoleDAL.getRoles();
    return roles.map((role) => RoleDto(role).getRole());
  }

  static async getRoleByName(roleName: string): Promise<getRole> {
    const role = await RoleDAL.getRoleByName(roleName);

    if (!role) throw new Error(ErrorTypeEnum.enum.ROLE_NOT_FOUND);

    return RoleDto(role).getRole();
  }

  static async deleteRole(roleId: string): Promise<getRole> {
    validateObjectId(roleId);

    const existingRole = await RoleDAL.getRoleById(roleId);
    if (!existingRole) {
      throw new Error(ErrorTypeEnum.enum.ROLE_NOT_FOUND);
    }

    if (existingRole.isSystemRole) {
      throw new Error(ErrorTypeEnum.enum.SYSTEM_ROLE_CANNOT_BE_DELETED);
    }

    // Check if role is assigned to any users using UserRole
    const usersWithRole = await UserRoleDAL.getUsersWithRole(roleId);
    if (usersWithRole.length > 0) {
      throw new Error(ErrorTypeEnum.enum.ROLE_IN_USE);
    }

    // Soft delete the role
    const role = await RoleDAL.softDeleteRole(roleId);

    if (!role) {
      throw new Error(ErrorTypeEnum.enum.ROLE_NOT_FOUND);
    }

    return RoleDto(role).getRole();
  }
}
