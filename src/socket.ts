import { io, Socket } from "socket.io-client";
import { GATEWAY_URL } from "./config";

let socket: Socket | null = null;

export const getSocket = (userId: number) => {
  if (!socket) {
    socket = io(GATEWAY_URL, {
      auth: { userId },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Global socket connected:", socket?.id);
    });
  }

  return socket;
};