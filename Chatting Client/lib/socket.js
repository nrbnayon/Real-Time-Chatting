import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (userId) => {
  if (!socket) {
    socket = io(process.env.API_URL || "http://localhost:4000", {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("Socket connected", "userId", userId);
      socket?.emit("user-online", userId);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }
  return socket;
};

export const getSocket = () => socket;
