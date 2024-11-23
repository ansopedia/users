import { NextFunction, Request, Response } from "express";

import { sendResponse } from "@/utils";

import { UserService } from "../user/user.service";
import { success } from "./profile.constant";
import { ProfileService } from "./profile.service";

export class ProfileController {
  static upSertProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await new ProfileService().upSertProfileData({
        userId: req.body.loggedInUser.userId,
        ...req.body,
      });
      sendResponse({
        response: res,
        message: success.PROFILE_UPDATED_SUCCESSFULLY,
        data: profile,
        statusCode: 200,
      });
    } catch (error) {
      next(error);
    }
  };

  static getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const profile = await new ProfileService().getProfileData(req.body.loggedInUser.userId);
      const user = await UserService.getUserById(req.body.loggedInUser.userId);
      sendResponse({
        response: res,
        message: success.PROFILE_FETCHED_SUCCESSFULLY,
        data: { profile, user },
        statusCode: 200,
      });
    } catch (error) {
      next(error);
    }
  };
}
