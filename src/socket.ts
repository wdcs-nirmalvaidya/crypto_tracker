import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (userId: number) => {
  if (!socket) {
    socket = io("http://localhost:5000", {
      auth: { userId },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Global socket connected:", socket?.id);
    });
  }

  return socket;
};