import { httpClient } from "../../../../lib/Axios";
import { MESSAGE_ENDPOINTS } from "../../api";

import type { APIResponse } from "../../../../types/api";
import type { Message, SendMessagePayload } from "../../../../types/message";
import type { User } from "../../../../types/user";

// Define specific response type for sidebar users
interface UsersForSidebarResponse {
  users: User[];
  unseenMessages: Record<string, number>;
}

// ✅ Get all users for the sidebar with unseen message counts
export const getUsersForSidebar = () =>
  httpClient.get<APIResponse<UsersForSidebarResponse>>(
    MESSAGE_ENDPOINTS.GET_USERS
  );

// ✅ Get messages between current user and selected user
export const getMessages = (id: string) =>
  httpClient.get<APIResponse<Message[]>>(MESSAGE_ENDPOINTS.GET_MESSAGES(id));

// ✅ Mark a specific message as seen
export const markAsSeen = (id: string) =>
  httpClient.put<APIResponse<null>>(MESSAGE_ENDPOINTS.MARK_AS_SEEN(id));

// ✅ Send a new message
export const sendMessage = (id: string, body: SendMessagePayload) =>
  httpClient.post<APIResponse<Message>>(
    MESSAGE_ENDPOINTS.SEND_MESSAGE(id),
    body
  );
