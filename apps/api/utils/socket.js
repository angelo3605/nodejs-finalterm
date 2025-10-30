import { Server } from "socket.io";

let io;

export const initSocket = (server, origin) => {
  io = new Server(server, {
    cors: {
      origin,
      credentials: true,
    },
  });
  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("WebSocket not initialized");
  }
  return io;
};
