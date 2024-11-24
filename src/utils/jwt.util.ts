import jwt from "jsonwebtoken";

import { AuthDAL } from "@/api/v1/auth/auth.dal";
import {
  JwtAccessToken,
  JwtActionToken,
  JwtRefreshToken,
  jwtAccessTokenSchema,
  jwtActionTokenSchema,
  jwtRefreshTokenSchema,
} from "@/api/v1/auth/auth.validation";
import { ErrorTypeEnum, envConstants } from "@/constants";

import { CryptoUtil } from "./crypto.util";

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_FOR_ACTION_SECRET } = envConstants;

export const tokenSecrets = {
  access: JWT_ACCESS_SECRET,
  refresh: JWT_REFRESH_SECRET,
  action: JWT_TOKEN_FOR_ACTION_SECRET,
};

export const generateAccessToken = async (payload: JwtAccessToken): Promise<string> => {
  const cryptoUtil = CryptoUtil.getInstance();
  const privateKey = cryptoUtil.getPrivateKey();

  const validPayload = jwtAccessTokenSchema.parse(payload);
  return jwt.sign(validPayload, privateKey, {
    algorithm: "RS256",
    expiresIn: "1h",
  });
};

export const generateRefreshToken = async (payload: JwtRefreshToken): Promise<string> => {
  const cryptoUtil = CryptoUtil.getInstance();
  const privateKey = cryptoUtil.getPrivateKey();

  const validPayload = jwtRefreshTokenSchema.parse(payload);
  return jwt.sign(validPayload, privateKey, {
    algorithm: "RS256",
    expiresIn: "7d",
  });
};

export const generateTokenForAction = (payload: JwtActionToken) => {
  const validPayload = jwtActionTokenSchema.parse(payload);
  return jwt.sign(validPayload, JWT_TOKEN_FOR_ACTION_SECRET, {
    expiresIn: "5m",
  });
};

export const verifyJWTToken = async <T>(token: string, tokenType: "access" | "refresh" | "action"): Promise<T> => {
  try {
    const cryptoUtil = CryptoUtil.getInstance();
    const publicKey = cryptoUtil.getPublicKey();

    const verifiedToken = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    });

    // Only check refresh tokens in database
    if (tokenType === "refresh") {
      const storedToken = await AuthDAL.getAuthByRefreshToken(token);
      if (!storedToken) {
        throw new Error(ErrorTypeEnum.enum.TOKEN_EXPIRED);
      }
    }

    return verifiedToken as T;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error(ErrorTypeEnum.enum.TOKEN_EXPIRED);
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(ErrorTypeEnum.enum.INVALID_TOKEN);
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error(ErrorTypeEnum.enum.INTERNAL_SERVER_ERROR);
    } else {
      throw error;
    }
  }
};

export const extractTokenFromBearerString = (bearerToken: string): string => {
  const [bearer, token] = bearerToken.split(" ");
  if (bearer !== "Bearer" || !token) throw new Error(ErrorTypeEnum.enum.INVALID_ACCESS);
  return token;
};
