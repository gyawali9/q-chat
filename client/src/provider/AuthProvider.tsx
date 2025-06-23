import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

import { useSocket } from "../hooks/useSocket";
import {
  checkAuth,
  loginUser,
  updateProfile as updateUser,
} from "../features/Auth/hooks/query";
import { AuthContext } from "../context/AuthContext";
import type { User } from "../types/user";
import type {
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from "../types/auth";
import type { ErrorResponse } from "../types/api";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [onlineUser, setOnlineUser] = useState<string[]>([]);

  const socket = useSocket(authUser?._id, setOnlineUser);

  const checktAndSetAuth = async () => {
    try {
      const { data } = await checkAuth();
      if (data.success) {
        const { user } = data.data;
        setAuthUser(user ?? null);
      }
    } catch (error) {
      console.log(error, "checkandsetauth");
      // toast.error(error?.message || "Authentication Failed");
    }
  };

  const login = async (
    state: string,
    credentials: LoginPayload | RegisterPayload
  ) => {
    try {
      const { data } = await loginUser(state, credentials);
      if (data.success) {
        const { user, token } = data.data;

        setAuthUser(user ?? null);
        setToken(token ?? null);
        if (token) {
          localStorage.setItem("token", token);
        }
        toast.success(data.message ?? "Login successful");
      } else {
        toast.error(data.message ?? "Login failed");
        throw new Error(data.message ?? "Login failed"); // ⬅️ Add this
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data as ErrorResponse;
        if (apiError?.errors?.length) {
          apiError.errors.forEach((e) => toast.error(e.message));
        } else {
          toast.error(apiError?.message || "Unexpected error occurred.");
        }
        throw error;
      } else {
        // Non-Axios errors (e.g. network, syntax)
        toast.error("Something went wrong.");
        throw error;
      }
    }
  };

  //   logout function to handle logout and socket disconnection
  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUser([]);
    toast.success("Logged out successfully");
    socket?.disconnect();
  };

  //   update profile function to handle user profile updates
  const updateProfile = async (body: UpdateProfilePayload) => {
    try {
      const { data } = await updateUser(body);
      if (data.success) {
        const { user } = data.data;
        setAuthUser(user ?? null);
        toast.success("Profile changed successfully");
      }
    } catch (error) {
      console.log("update profile error", error);
      // toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      checktAndSetAuth();
    }
  }, [token]);

  const value = {
    token,
    socket,
    authUser,
    onlineUser,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
