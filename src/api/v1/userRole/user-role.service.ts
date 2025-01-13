import * as z from "zod";

import { ErrorTypeEnum } from "@/constants";
import { validateObjectId } from "@/utils";

import { UserRoleDAL } from "./user-role.dal";
import { UserRoleDto } from "./user-role.dto";
import { UserRole, userRoleSchema } from "./user-role.validation";

export class UserRoleService {
  static async createUserRole(userRole: UserRole) {
    const validUserRole = userRoleSchema.parse(userRole);

    const isUserRoleExist = await UserRoleDAL.exists(validUserRole);

    if (isUserRoleExist) throw new Error(ErrorTypeEnum.enum.USER_ROLE_ALREADY_EXISTS);

    const newUserRole = await UserRoleDAL.createUserRole(validUserRole);

    return UserRoleDto(newUserRole).getUserRole();
  }

  static async getUserRoles(userId: string) {
    validateObjectId(userId);
    const userRoles = await UserRoleDAL.getUserRoles(userId);
    return userRoles.map((role) => UserRoleDto(role).getUserRole());
  }

  static async assignRoles(userId: string, roleIds: string[]) {
    validateObjectId(userId);

    const userRoles = roleIds.map((roleId) => ({
      userId,
      roleId,
    }));

    const validUserRoles = z.array(userRoleSchema).parse(userRoles);

    // Bulk create user roles
    const createdRoles = await Promise.all(
      validUserRoles.map(async (role) => {
        const exists = await UserRoleDAL.exists(role);
        if (!exists) {
          const newRole = await UserRoleDAL.createUserRole(role);
          return UserRoleDto(newRole).getUserRole();
        }
        return null;
      })
    );

    return createdRoles.filter(Boolean);
  }

  static async removeUserRole(userId: string, roleId: string) {
    validateObjectId(userId);
    validateObjectId(roleId);

    const deletedRole = await UserRoleDAL.deleteUserRole(userId, roleId);
    if (!deletedRole) {
      throw new Error(ErrorTypeEnum.enum.USER_ROLE_NOT_FOUND);
    }

    return UserRoleDto(deletedRole).getUserRole();
  }

  static async removeAllUserRoles(userId: string) {
    validateObjectId(userId);
    await UserRoleDAL.deleteUserRoles(userId);
  }

  static async removeRoleAssignments(roleId: string) {
    validateObjectId(roleId);
    await UserRoleDAL.deleteRoleAssignments(roleId);
  }
}
