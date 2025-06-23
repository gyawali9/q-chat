import { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

import {
  getMessages as getMessagesForSelectedUser,
  getUsersForSidebar,
  markAsSeen,
  sendMessage as sendMessageToSelectedUser,
} from "../features/Message/hooks/query";
import { ChatContext } from "../context/ChatContext";
import type { ErrorResponse } from "../types/api";
import { type Message, type SendMessagePayload } from "../types/message";
import type { User } from "../types/user";

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  // list of users for sidebar
  const [users, setUsers] = useState<User[]>([]);
  // store id of selecteed user
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // users id and no of messages unseen
  const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>(
    {}
  );

  const { socket } = useContext(AuthContext)!;

  // function to get all users for sidebar
  const getusers = useCallback(async () => {
    try {
      const { data } = await getUsersForSidebar();
      if (data.success) {
        const { users, unseenMessages } = data.data;
        setUsers(users);
        setUnseenMessages(unseenMessages);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ErrorResponse;
        if (apiError?.errors?.length) {
          apiError.errors.forEach((e) => toast.error(e.message));
        } else {
          toast.error(apiError?.message || "Unexpected error occurred.");
        }
      } else {
        // Non-Axios errors (e.g. network, syntax)
        toast.error("Something went wrong.");
      }
    }
  }, []);

  // function to get messages for selected users
  const getMessages = async (userId: string) => {
    try {
      const { data } = await getMessagesForSelectedUser(userId);
      if (data.success) {
        setMessages(data.data);
      }
    } catch {
      toast.error("Failed to fetch messages.");
    }
  };

  // function to send message to selected user

  const sendMessage = async (messageData: SendMessagePayload) => {
    try {
      const { data } = await sendMessageToSelectedUser(
        selectedUser?._id ?? "",
        messageData
      );
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.data]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message.");
    }
  };

  // function to subscribe to message for selected user
  const subscribeToMessages = useCallback(() => {
    if (!socket) return;

    socket.on("newMessage", async (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        await markAsSeen(newMessage._id);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]:
            prevUnseenMessages[
              newMessage.senderId
                ? prevUnseenMessages[newMessage.senderId] + 1
                : 1
            ],
        }));
      }
    });
  }, [socket, selectedUser]);

  // function to unsubscribe from messages
  const unsubscribeFromMessages = useCallback(() => {
    if (socket) socket.off("newMessage");
  }, [socket]);

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser, subscribeToMessages, unsubscribeFromMessages]);

  const value = {
    messages,
    users,
    selectedUser,
    unseenMessages,
    getusers,
    getMessages,
    sendMessage,
    setSelectedUser,
    setUnseenMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
