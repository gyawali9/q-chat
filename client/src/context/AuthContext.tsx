import { createContext } from "react";
import { Socket } from "socket.io-client";

import type { User } from "../types/user";
import type { UpdateProfilePayload } from "../types/auth";
import type { LoginPayload, RegisterPayload } from "../pages/LoginPage";

export interface AuthContextProps {
  token: string | null;
  authUser: User | null;
  onlineUser: string[];
  socket: Socket | null;
  login: (
    state: string,
    credentials: LoginPayload | RegisterPayload
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (body: UpdateProfilePayload) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);
