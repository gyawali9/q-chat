import { api } from "../api/axios";
import { AUTH_ENDPOINTS } from "../constants/endpoints";
import type { LoginPayload, RegisterPayload } from "../pages/LoginPage";

import type { ApiResponse } from "../types/api";
import type { UpdateProfilePayload } from "../types/auth";
import type { User } from "../types/user";

export const loginUser = (
  state: string,
  credentials: LoginPayload | RegisterPayload
) => api.post<ApiResponse<User>>(AUTH_ENDPOINTS.LOGIN(state), credentials);

export const checkAuth = () => api.get<ApiResponse<User>>(AUTH_ENDPOINTS.CHECK);

export const updateProfile = (body: UpdateProfilePayload) => {
  return api.put<ApiResponse<User>>(AUTH_ENDPOINTS.UPDATE_PROFILE, body);
};
