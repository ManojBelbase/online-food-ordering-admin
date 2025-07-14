import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { appStore } from "../redux/store/store";
import { logout, refreshToken } from "../redux/slices/authSlice";

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
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

makeRequest.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const state = appStore.getState();
    const token = state.auth.accessToken;

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
            originalReq.headers!["Authorization"] =`Bearer ${newToken}`;
            resolve(makeRequest(originalReq));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newToken = data.accessToken;
        appStore.dispatch(
          refreshToken({
            user: data.user,
            accessToken: newToken,
          })
        );

        processQueue(null, newToken);
        originalReq.headers!["Authorization"] = `Bearer ${newToken}`;
        return makeRequest(originalReq);
      } catch (err) {
        processQueue(err as Error, null);
        appStore.dispatch(logout());
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
}
);