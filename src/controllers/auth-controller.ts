import { Request, Response } from 'express';
import { UserModel } from '../models/User';

import { generateAndStoreAuthTokens } from '../utils/jwt-token';
import { sendApiResponse } from '../utils/sendApiResponse';
import {
  ACCOUNT_DISABLED_ERROR,
  EMAIL_ALREADY_EXISTS_ERROR,
  INTERNAL_SERVER_ERROR,
  INVALID_CREDENTIALS_ERROR,
  STATUS_CODES,
  USER_NOT_FOUND_ERROR,
} from '../constants';
import {
  LOGGED_IN_SUCCESSFULLY,
  USER_CREATED_SUCCESSFULLY,
} from '../constants/messages/success';

export class AuthController {
  static async createUserWithEmailAndPassword(
    req: Request,
    response: Response,
  ) {
    const { name, email, password } = req.body;
    try {
      const isUserExist = await UserModel.findOne({ email });
      if (isUserExist) {
        sendApiResponse({
          response,
          statusCode: STATUS_CODES.CONFLICT,
          message: EMAIL_ALREADY_EXISTS_ERROR,
        });
        return;
      }

      const user = new UserModel({ name, email, password });
      const tokens = generateAndStoreAuthTokens(user);
      await user.save();

      response.setHeader('Authorization', tokens.accessToken);
      response.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      sendApiResponse({
        response,
        statusCode: STATUS_CODES.CREATED,
        message: USER_CREATED_SUCCESSFULLY,
      });
    } catch (error) {
      sendApiResponse({
        response,
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  }

  static async signInWithEmailAndPassword(req: Request, response: Response) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        sendApiResponse({
          response,
          statusCode: STATUS_CODES.NOT_FOUND,
          message: USER_NOT_FOUND_ERROR,
        });
        return;
      }

      const { password: savedPassword, isAccountDisabled } = user;

      if (savedPassword !== password) {
        sendApiResponse({
          response,
          statusCode: STATUS_CODES.UNAUTHORIZED,
          message: INVALID_CREDENTIALS_ERROR,
        });
        return;
      }

      if (isAccountDisabled) {
        sendApiResponse({
          response,
          statusCode: STATUS_CODES.FORBIDDEN,
          message: ACCOUNT_DISABLED_ERROR,
        });
        return;
      }

      const tokens = generateAndStoreAuthTokens(user);
      await user.save();

      response.setHeader('Authorization', tokens.accessToken);
      response.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
      });
      sendApiResponse({
        response,
        statusCode: STATUS_CODES.OK,
        message: LOGGED_IN_SUCCESSFULLY,
      });
    } catch (error) {
      sendApiResponse({
        response,
        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: INTERNAL_SERVER_ERROR,
        errors: error as Error,
      });
    }
  }
}
