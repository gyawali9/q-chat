import axios from "axios";
import type { ErrorResponse } from "../types/api";
import toast from "react-hot-toast";

const backendUrl =
  import.meta.env.MODE !== "development"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:5001";

export const httpClient = axios.create({
  baseURL: backendUrl,
  withCredentials: true, // allow sending cookies (for refresh token)
});

// Axios interceptor to attach token
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // ✅ correct header format
  }
  return config;
});

// Response interceptor to handle token expiration
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const apiError = error.response?.data as ErrorResponse;

    const isAccessTokenExpired =
      error.response?.status === 401 && apiError?.message === "Token expired";

    if (isAccessTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh token endpoint
        const refreshResponse = await httpClient.get(
          `${backendUrl}/auth/refresh-token`,
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.data.token;
        localStorage.setItem("token", newToken);

        // Update Authorization header
        if (originalRequest && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Retry the original request
        return httpClient(originalRequest);
      } catch (refreshError) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Other unauthorized cases (invalid token, etc.)
    if (
      error.response?.status === 401 &&
      (apiError?.message === "Invalid token" ||
        apiError?.message === "Unauthorized")
    ) {
      toast.error("Invalid session. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    // Log other errors
    if (apiError?.message) {
      console.error("API Error:", apiError.message);
    }
    return Promise.reject(error); // re-throw for per-request handling
  }
);
