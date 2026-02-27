"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/features/user/models/user";
import { ChatService } from "@/features/message/services/chat-service-ws";
import Cookies from "js-cookie";

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);


export function UserProvider({
  initialUser,
  children,
}: {
  initialUser: User | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const chatService = ChatService.getInstance();

  // Kết nối WebSocket khi user đã authenticate
  useEffect(() => {
    if (user && user.id) {
      const token = Cookies.get('token');
      if (token && !chatService.isConnected()) {
        chatService.connect(token).catch(() => {});
      }
    } else {
      // Ngắt kết nối khi user logout
      if (chatService.isConnected()) {
        chatService.disconnect();
      }
    }

    return () => {
      // Cleanup khi component unmount
      if (chatService.isConnected()) {
        chatService.disconnect();
      }
    };
  }, [user, chatService]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}


export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
