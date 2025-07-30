import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((cb) => {
    if (error) {
      cb("");
    } else {
      cb(token!);
    }
  });
  failedQueue = [];
};

export const makeRequest: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL || "https://food-ordering-backend-36ba.vercel.app/api/v1/",
  withCredentials: true,
});

makeRequest.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

makeRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config;
    const status = error.response?.status;
    if (status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push((newToken: string) => {
            if (!newToken) {
              reject("Refresh failed");
              return;
            }
            originalReq.headers!["Authorization"] = `Bearer ${newToken}`;
            resolve(makeRequest(originalReq));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newToken = data.accessToken;
        localStorage.setItem("accessToken", newToken);

        // Notify components to update Redux state (e.g., via a global event)
        window.dispatchEvent(
          new CustomEvent("auth:refreshToken", {
            detail: { user: data.user, accessToken: newToken },
          })
        );

        processQueue(null, newToken);
        originalReq.headers!["Authorization"] = `Bearer ${newToken}`;
        return makeRequest(originalReq);
      } catch (err) {
        processQueue(err as Error, null);
        // Notify components of logout
        window.dispatchEvent(new CustomEvent("auth:logout"));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);