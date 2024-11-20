import supertest, { Response } from "supertest";

import { success } from "@/api/v1/rolePermission/role-permission.constant";
import { RolePermission } from "@/api/v1/rolePermission/role-permission.validation";
import { app } from "@/app";
import { STATUS_CODES } from "@/constants";

export const createRolePermissionRequest = async (rolePermission: RolePermission, authorizationHeader: string) => {
  return await supertest(app)
    .post("/api/v1/role-permissions")
    .send(rolePermission)
    .set("authorization", authorizationHeader);
};

export const expectCreateRolePermissionSuccess = (response: Response, rolePermission: RolePermission): void => {
  expect(response).toBeDefined();

  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);

  expect(body).toMatchObject({
    message: success.ROLE_PERMISSION_CREATED_SUCCESSFULLY,
    data: {
      rolePermission: {
        roleId: rolePermission.roleId,
        permissionId: rolePermission.permissionId,
      },
    },
  });
};
