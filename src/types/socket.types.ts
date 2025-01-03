import { Server, Socket } from "socket.io";

export type UserConnectionEvent = {
  userId: string;
  timestamp: number;
};

export type UserUpdateEvent = {
  userId: string;
  updates: {
    field: string;
    value: unknown;
  }[];
};

export type NotificationEvent = {
  id: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp: number;
};

export interface ServerToClientEvents {
  "user:connected": (event: UserConnectionEvent) => void;
  "user:disconnected": (event: UserConnectionEvent) => void;
  "user:updated": (event: UserUpdateEvent) => void;
  "notification:received": (event: NotificationEvent) => void;
  "role:updated": (data: { userId: string; roles: string[] }) => void;
}

export interface ClientToServerEvents {
  "profile:update": (data: unknown) => void;
  "role:update": (data: { roles: string[] }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
}

export interface SocketUser {
  userId: string;
  socketId: string;
}

export type CustomSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export type CustomServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
