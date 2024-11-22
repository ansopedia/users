import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import { envConstants } from "@/constants";
import { allowedOrigins } from "@/middlewares";
import { CustomServer, CustomSocket } from "@/types/socket.types";

import { connectionManager } from "./socket/connection-manager";
import { setupEventHandlers } from "./socket/handlers";
import { setupSocketMiddleware } from "./socket/middleware";

const ALLOWED_ORIGINS = envConstants.NODE_ENV === "development" ? "*" : allowedOrigins;

export const initializeSocket = (httpServer: HttpServer): CustomServer => {
  // 1. Initialize Socket.IO server
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: ALLOWED_ORIGINS,
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    connectTimeout: 60000,
  });

  // 2. Apply authentication middleware
  setupSocketMiddleware(io);

  // 3. Handle new connections
  io.on("connection", (socket: CustomSocket) => {
    const { userId } = socket.data;

    // 4. Track connected user
    connectionManager.addUser(userId, socket.id);

    // 5. Notify others of new connection
    io.emit("user:connected", { userId, timestamp: Date.now() });

    // 6. Setup event handlers
    const handlers = setupEventHandlers(socket);
    socket.on("disconnect", () => {
      connectionManager.removeUser(userId);
      handlers.handleDisconnect();
    });
  });

  return io;
};

export const getConnectedUsers = () => connectionManager.getConnectedUsers();
