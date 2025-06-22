import { createContext } from "react";
import type { Message, SendMessagePayload } from "../types/message";
import type { User } from "../types/user";

export interface ChatContextProps {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  unseenMessages: Record<string, number>;
  getusers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  // sendMessage: (messageData: { content: SendMessagePayload }) => Promise<void>;
  sendMessage: (message: SendMessagePayload) => Promise<void>;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUnseenMessages: React.Dispatch<
    React.SetStateAction<Record<string, number>>
  >;
}
export const ChatContext = createContext<ChatContextProps | null>(null);
