import { Response, request } from "express";
import { ZodIssue } from "zod";

import { envConstants } from "@/constants";

import { errorLogger } from "./logger";

export interface SendResponse<T = undefined> {
  response: Response;
  code?: string;
  statusCode: number;
  status?: "success" | "failed";
  message: string;
  errorDetails?: Error;
  data?: T;
  errors?: ZodIssue[];
}

export const sendResponse = <T>(responseData: SendResponse<T>) => {
  const { response, statusCode, message, errorDetails, status = "success", data, errors, code } = responseData;
  const isProduction = envConstants.NODE_ENV === "production";

  const responseBody: Record<string, unknown> = { status, message, data, code, errors };

  if (!isProduction && errorDetails) {
    responseBody.errorDetails = {
      message: errorDetails.message,
      stack: errorDetails.stack,
    };
  }

  if (errorDetails && statusCode >= 500) {
    errorLogger.error(
      `Error occurred in ${request.url}: ${errorDetails.name} ${errorDetails.message} ${errorDetails.stack}`
    );
  }

  response.status(statusCode).json(responseBody);
};
