import { NextFunction, Request, Response } from "express";

import { STATUS_CODES } from "@/constants";
import { sendResponse } from "@/utils";

import { success } from "./permission.constant";
import { PermissionService } from "./permission.service";

export const createPermission = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createdPermission = await PermissionService.createPermission(req.body);
    sendResponse({
      response: res,
      message: success.PERMISSION_CREATED_SUCCESSFULLY,
      data: {
        permission: createdPermission,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    next(error);
  }
};

export const getPermissions = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const permissions = await PermissionService.getPermissions();
    sendResponse({
      response: res,
      message: success.PERMISSION_FETCHED_SUCCESSFULLY,
      data: {
        permissions,
      },
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    next(error);
  }
};
