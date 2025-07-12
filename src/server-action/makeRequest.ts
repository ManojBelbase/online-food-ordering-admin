import { notifications } from "@mantine/notifications";
import axios from "axios";
import type { AxiosInstance } from "axios";
import Cookies from "js-cookie";

let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];
let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

const makeRequest: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://food-ordering-backend-axbt.onrender.com/api/v1/',
});


makeRequest.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.headers['Content-Type'] = 'application/json';
  config.headers['Accept'] = 'application/json';

  return config;
});

// Handle token expiration
makeRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.detail;

    if (
      message === "jwt expired" ||
      message === "invalid token" ||
      message === "jwt malformed" ||
      message === "Token has expired this is message" ||
      error?.response?.data?.statusText === "Unauthorized" ||
      message === "Token has expired"
    ) {
      const refreshToken = Cookies.get("refreshToken");

      if (!refreshToken) {
        logoutCallback?.();
        notifications.show({
          title: "Session Expired",
          message: "Please log in again.",
          icon: "error",
          className: "bg-red-50",
        });

        return Promise.reject("Unauthorized");
      }

      if (!isRefreshing) {
        isRefreshing = true;
        Cookies.remove("accessToken");

        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_URL}auth/refresh-token`,
            {
              refresh_token: refreshToken,
            },
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          // Handle different response structures
          let accessToken, newRefreshToken;

          if (res.data?.accessToken || res.data?.access_token) {
            // If response has direct accessToken
            accessToken = res.data.accessToken || res.data.access_token;
            newRefreshToken = res.data.refreshToken || res.data.refresh_token;
          } else if (res.data?.data) {
            // If response has nested data structure (fallback)
            accessToken =
              res.data.data.accessToken || res.data.data.access_token;
            newRefreshToken =
              res.data.data.refreshToken || res.data.data.refresh_token;
          } else {
            // Fallback - log the actual structure
            console.error("Unexpected response structure:", res.data);
            throw new Error(
              "Invalid response structure from refresh token endpoint"
            );
          }

          // Set cookies without secure flag in development
          const isDevelopment = process.env.NODE_ENV === "development";
          Cookies.set("accessToken", accessToken, {
            secure: !isDevelopment,
            sameSite: "strict",
          });
          Cookies.set("refreshToken", newRefreshToken, {
            secure: !isDevelopment,
            sameSite: "strict",
          });

          failedQueue.forEach((cb) => cb(accessToken));
          failedQueue = [];
          isRefreshing = false;

          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return makeRequest(error.config);
        } catch (err) {
          logoutCallback?.();
          Cookies.remove("refreshToken");
          Cookies.remove("accessToken");
          notifications.show({
            title: "Session Expired",
            message: "Login again to continue.",
            icon: "error",
            className: "bg-red-50",
          });

          failedQueue = [];
          isRefreshing = false;
          return Promise.reject(err);
        }
      } else {
        // Wait for token refresh to finish
        return new Promise((resolve) => {
          failedQueue.push((token: string) => {
            error.config.headers.Authorization = `Bearer ${token}`;
            resolve(makeRequest(error.config));
          });
        });
      }
    }

    if (status === 403) {
      Cookies.remove("refreshToken");
      Cookies.remove("accessToken");
      logoutCallback?.();
      notifications.show({
        title: "Forbidden",
        message: "Your session has expired.",
        icon: "error",
        className: "bg-red-50",
      });
      console.log("403 Forbidden - would normally logout");
    }

    return Promise.reject(error);
  }
);

export { makeRequest };
