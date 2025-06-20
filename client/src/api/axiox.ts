import axios from "axios";

import type { ApiResponse } from "../types/api";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: backendUrl,
});

// Axios interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["token"] = token;
  return config;
});

// Optional: centralized error interceptor (logging or toast)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response?.data as ApiResponse;

    if (apiError?.message) {
      console.error("API Error:", apiError.message);
    }
    return Promise.reject(error); // re-throw for per-request handling
  }
);
