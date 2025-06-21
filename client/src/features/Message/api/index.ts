export const MESSAGE_ENDPOINTS = {
  GET_USERS: "/api/v1/messages/users",
  GET_MESSAGES: (id: string) => `/api/v1/messages/${id}`,
  MARK_AS_SEEN: (id: string) => `/api/v1/messages/mark/${id}`,
  SEND_MESSAGE: (id: string) => `/api/v1/messages/send/${id}`,
};
