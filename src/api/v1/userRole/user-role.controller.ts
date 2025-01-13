import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { success } from "./user-role.constant";
import { UserRoleService } from "./user-role.service";

export const createUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userRole = await UserRoleService.createUserRole(req.body);
    sendResponse({
      response: res,
      message: success.USER_ROLE_CREATED_SUCCESSFULLY,
      data: {
        userRole,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

export const assignUserRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userRoles = await UserRoleService.assignRoles(req.params.userId, req.body.roleIds);
    sendResponse({
      response: res,
      message: success.USER_ROLES_ASSIGNED_SUCCESSFULLY,
      data: { userRoles },
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    next(error);
  }
};

export const removeUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userRole = await UserRoleService.removeUserRole(req.params.userId, req.params.roleId);
    sendResponse({
      response: res,
      message: success.USER_ROLE_DELETED_SUCCESSFULLY,
      data: { userRole },
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    next(error);
  }
};
