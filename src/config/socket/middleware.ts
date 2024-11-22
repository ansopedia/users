import { Server } from "socket.io";

import { JwtAccessToken } from "@/api/v1/auth/auth.validation";
import { CustomSocket } from "@/types/socket.types";
import { verifyJWTToken } from "@/utils/jwt.util";
import logger from "@/utils/logger";

export const setupSocketMiddleware = (io: Server) => {
  io.use(async (socket: CustomSocket, next) => {
    try {
      // 1. Extract token from connection request
      const { token } = socket.handshake.auth;

      if (typeof token !== "string") {
        throw new Error("Authentication token required");
      }

      // 2. Validate token
      const decoded = await verifyJWTToken<JwtAccessToken>(token, "access");

      // 3. Attach user data to socket
      socket.data.userId = decoded.userId;
      logger.info(`Socket authenticated for user: ${decoded.userId}`);
      next();
    } catch (error) {
      next(error as Error);
    }
  });
};
