export const AUTH_ENDPOINTS = {
  LOGIN: (state: string) => `/api/v1/auth/${state}`,
  CHECK: "/api/v1/auth/check",
  UPDATE_PROFILE: "/api/v1/auth/update-profile",
};

export const MESSAGE_ENDPOINTS = {
  GET_USERS: "/api/v1/messages/users",
  GET_MESSAGES: (id: string) => `/api/v1/messages/${id}`,
  MARK_AS_SEEN: (id: string) => `/api/v1/messages/mark/${id}`,
  SEND_MESSAGE: (id: string) => `/api/v1/messages/send/${id}`,
};
