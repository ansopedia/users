import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { ErrorTypeEnum, getErrorObject } from "@/constants";
import { sendResponse } from "@/utils/send-response.util";

export const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    const errorObj = getErrorObject(ErrorTypeEnum.enum.VALIDATION_ERROR);
    sendResponse({
      status: "failed",
      response: res,
      statusCode: errorObj.httpStatusCode,
      message: errorObj.body.message,
      errorDetails: err,
      code: errorObj.body.code,
      errors: err.issues,
    });
    return next();
  }

  const errorObj = getErrorObject(err.message as unknown as ErrorTypeEnum);
  sendResponse({
    status: "failed",
    response: res,
    statusCode: errorObj.httpStatusCode,
    message: errorObj.body.message,
    errorDetails: err,
    code: errorObj.body.code,
  });
  next();
};
