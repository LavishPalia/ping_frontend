"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { chat_service, useAppData } from "./AppContext";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

interface ProviderProps {
  children: React.ReactNode;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const SocketProvider = ({ children }: ProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user } = useAppData();

  useEffect(() => {
    if (!user?._id) return;

    const newSocket = io(chat_service, {
      query: { userId: user._id },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
    setSocket(newSocket);

    newSocket.on("getOnlineUser", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      newSocket.off("getOnlineUser");
      newSocket.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const SocketData = () => useContext(SocketContext);
