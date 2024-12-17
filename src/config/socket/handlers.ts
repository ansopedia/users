import { CustomSocket } from "@/types/socket.types";
import logger from "@/utils/logger";

export const setupEventHandlers = (socket: CustomSocket) => {
  const { userId } = socket.data;

  const handlers = {
    handleDisconnect: () => {
      logger.info(`User disconnected: ${userId}`);
      socket.broadcast.emit("user:disconnected", {
        userId,
        timestamp: Date.now(),
      });
    },

    handleError: (error: Error) => {
      logger.error(`Socket error for user ${userId}:`, error);
    },
  };

  return handlers;
};
