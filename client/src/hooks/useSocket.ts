import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = (
  userId?: string,
  setOnlineUser?: (ids: string[]) => void
) => {
  const backend_url =
    import.meta.env.NODE_ENV !== "development"
      ? import.meta.env.VITE_BACKEND_URL
      : "http://localhost:5001";
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (userId && !socketRef.current) {
      const socket = io(backend_url, {
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
