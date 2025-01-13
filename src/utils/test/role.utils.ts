import supertest, { Response } from "supertest";

import { success } from "@/api/v1/role/role.constant";
import { createRole } from "@/api/v1/role/role.validation";
import { app } from "@/app";
import { STATUS_CODES } from "@/constants";

export const createRoleRequest = async (role: createRole, authorizationHeader: string): Promise<Response> => {
  return supertest(app).post("/api/v1/roles").send(role).set("authorization", authorizationHeader);
};

export const expectCreateRoleSuccess = (response: Response, { name, description }: createRole): void => {
  expect(response).toBeDefined();

  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.CREATED);

  expect(body).toMatchObject({
    message: success.ROLE_CREATED_SUCCESSFULLY,
    data: {
      role: {
        id: expect.any(String),
        name,
        description,
      },
    },
  });
};

export const getRoles = async (authorizationHeader: string): Promise<Response> => {
  return await supertest(app).get("/api/v1/roles").set("authorization", authorizationHeader);
};

export const expectGetRolesSuccess = (response: Response): void => {
  expect(response).toBeDefined();

  const { statusCode, body } = response;

  expect(statusCode).toBe(STATUS_CODES.OK);
  expect(body).toMatchObject({
    message: success.ROLES_FETCHED_SUCCESSFULLY,
    data: {
      roles: expect.any(Array),
    },
  });
};

export const deleteRoleRequest = (roleId: string, authorizationHeader: string) => {
  return supertest(app).delete(`/api/v1/roles/${roleId}`).set("Authorization", authorizationHeader);
};

export const expectDeleteRoleSuccess = (response: Response, roleData: any) => {
  expect(response.statusCode).toBe(STATUS_CODES.OK);
  expect(response.body.message).toBe(success.ROLE_DELETED_SUCCESSFULLY);
  expect(response.body.data.role).toBeDefined();
  expect(response.body.data.role.name).toBe(roleData.name);
};
