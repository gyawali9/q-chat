import { api } from "../api/axiox";
import { AUTH_ENDPOINTS } from "../constants/endpoints";
import type { LoginPayload, RegisterPayload } from "../pages/LoginPage";

import type { ApiResponse } from "../types/api";
import type { User } from "../types/user";

export const loginUser = (
  state: string,
  credentials: LoginPayload | RegisterPayload
) => api.post<ApiResponse<User>>(AUTH_ENDPOINTS.LOGIN(state), credentials);

export const checkAuth = () => api.get<ApiResponse<User>>(AUTH_ENDPOINTS.CHECK);

export const updateProfile = (body: unknown) =>
  api.put<ApiResponse<User>>(AUTH_ENDPOINTS.UPDATE_PROFILE, body);
