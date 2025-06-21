import { api } from "../api/axios";
import { MESSAGE_ENDPOINTS } from "../constants/endpoints";

import type { ApiResponse } from "../types/api";
import type { Message } from "../types/message";
import type { User } from "../types/user";

// Define specific response type for sidebar users
interface UsersForSidebarResponse {
  users: User[];
  unseenMessages: Record<string, number>;
}

export interface SendMessagePayload {
  text?: string;
  image?: string;
}

// ✅ Get all users for the sidebar with unseen message counts
export const getUsersForSidebar = () =>
  api.get<ApiResponse<UsersForSidebarResponse>>(MESSAGE_ENDPOINTS.GET_USERS);

// ✅ Get messages between current user and selected user
export const getMessages = (id: string) =>
  api.get<ApiResponse<Message[]>>(MESSAGE_ENDPOINTS.GET_MESSAGES(id));

// ✅ Mark a specific message as seen
export const markAsSeen = (id: string) =>
  api.put<ApiResponse<null>>(MESSAGE_ENDPOINTS.MARK_AS_SEEN(id));

// ✅ Send a new message
export const sendMessage = (id: string, body: SendMessagePayload) =>
  api.post<ApiResponse<Message>>(MESSAGE_ENDPOINTS.SEND_MESSAGE(id), body);
