import axios from "axios";
import type { ErrorResponse } from "../types/api";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const httpClient = axios.create({
  baseURL: backendUrl,
});

// Axios interceptor to attach token
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ correct header format
  }
  return config;
});

// Optional: centralized error interceptor (logging or toast)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response?.data as ErrorResponse;

    if (apiError?.message) {
      console.error("API Error:", apiError.message);
    }
    return Promise.reject(error); // re-throw for per-request handling
  }
);
