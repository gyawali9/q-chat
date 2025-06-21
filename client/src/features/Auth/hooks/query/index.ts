import { httpClient } from "../../../../lib/Axios";
import { AUTH_ENDPOINTS } from "../../api";

import type { APIResponse, AuthResponseUserData } from "../../../../types/api";
import type {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from "../../../../types/auth";
import type { User } from "../../../../types/user";

export const loginUser = (
  state: string,
  credentials: LoginPayload | RegisterPayload
) =>
  httpClient.post<APIResponse<AuthResponseUserData<User>>>(
    AUTH_ENDPOINTS.LOGIN(state),
    credentials
  );

export const checkAuth = () =>
  httpClient.get<APIResponse<AuthResponseUserData<User>>>(AUTH_ENDPOINTS.CHECK);

export const updateProfile = (body: UpdateProfilePayload) => {
  return httpClient.put<APIResponse<AuthResponseUserData<User>>>(
    AUTH_ENDPOINTS.UPDATE_PROFILE,
    body
  );
};
