import { SocketUser } from "@/types/socket.types";

class ConnectionManager {
  private connectedUsers: Map<string, SocketUser>;

  constructor() {
    this.connectedUsers = new Map();
  }

  addUser(userId: string, socketId: string) {
    this.connectedUsers.set(userId, { userId, socketId });
  }

  removeUser(userId: string) {
    this.connectedUsers.delete(userId);
  }

  getConnectedUsers() {
    return Array.from(this.connectedUsers.values());
  }

  isUserConnected(userId: string) {
    return this.connectedUsers.has(userId);
  }
}

export const connectionManager = new ConnectionManager();
