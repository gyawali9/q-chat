import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (
  userId?: string,
  setOnlineUser?: (ids: string[]) => void
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (userId && !socketRef.current) {
      const socket = io(import.meta.env.VITE_BACKEND_URL, {
        query: { userId },
      });
      socketRef.current = socket;

      socket.on("getOnlineusers", (userIds: string[]) => {
        setOnlineUser?.(userIds);
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    }
  }, [userId, setOnlineUser]);

  return socketRef.current;
};
