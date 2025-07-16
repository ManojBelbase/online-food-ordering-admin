import axios from "axios";

// Configure base URL from environment variables
// export const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}api/`;
// export const API_BASE_URL_EN = `${import.meta.env.VITE_API_LOCAL_URL}`;
// export const network = "http://62.72.42.129:8100/api/v1/en";

export const VITE_REACT_APP_API_URL =
  "https://food-ordering-backend-36ba.vercel.app/api/v1/";

export const apiClient = axios.create({
  baseURL: VITE_REACT_APP_API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

const controllers = new Map<string, AbortController>();

apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("accessToken");

    // Only add authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Cancel any previous request to the same endpoint
    if (config.url && controllers.has(config.url)) {
      controllers.get(config.url)?.abort();
      controllers.delete(config.url);
    }

    // Create a new AbortController and attach signal to request
    const controller = new AbortController();
    config.signal = controller.signal;
    if (config.url) controllers.set(config.url, controller);

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (response.config.url) {
      controllers.delete(response.config.url);
    }
    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.log(error);
      }

      console.log(error, "from interceptor");

      if (error.response?.data?.error) {
        const errorMessage = error.response.data.error[0]?.message;
        return Promise.reject(errorMessage);
      }

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";

      return Promise.reject(errorMessage);
    }

    if (axios.isCancel(error)) {
      return Promise.resolve({ canceled: true });
    }

    return Promise.reject("An unexpected error occurred");
  }
);

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}