/* eslint-disable no-console */
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import { app } from "./app";
import { initializeSocket } from "./config";

const server = http.createServer(app);
let io: SocketIOServer | undefined;

export const startServer = async (port: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      server.listen(port, () => {
        // Initialize Socket.IO
        io = initializeSocket(server);

        console.log(`🚀 Server is running on port ${port}`);
        resolve();
      });

      server.on("error", (error) => {
        console.error("Server error:", error);
        reject(error);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      reject(error);
    }
  });
};

export const stopServer = (): Promise<void> => {
  console.log("Server is shutting down...");

  return new Promise((resolve, reject) => {
    if (io) {
      io.close();
    }

    server.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export default app;
