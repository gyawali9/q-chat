export const AUTH_ENDPOINTS = {
  LOGIN: (state: string) => `/api/v1/auth/${state}`,
  CHECK: "/api/v1/auth/check",
  UPDATE_PROFILE: "/api/v1/auth/update-profile",
};
