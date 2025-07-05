// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class ApiService {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
  }

  private getAuthToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  private getHeaders(
    customHeaders: Record<string, string> = {}
  ): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || "An error occurred",
          status: response.status,
          code: data.code,
        } as ApiError;
      }

      return data;
    } else {
      if (!response.ok) {
        throw {
          message: `HTTP Error: ${response.status}`,
          status: response.status,
        } as ApiError;
      }

      const text = await response.text();
      return {
        success: true,
        data: text as T,
      };
    }
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, String(params[key]));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(customHeaders),
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.getHeaders(customHeaders),
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: this.getHeaders(customHeaders),
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  // File upload helper
  async uploadFile<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    if (additionalData) {
      Object.keys(additionalData).forEach((key) => {
        formData.append(key, String(additionalData[key]));
      });
    }

    return this.post<T>(endpoint, formData, {
      "Content-Type": "",
    });
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Specific API endpoints
export const ordersApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => apiService.get("/orders", params),

  getById: (id: string) => apiService.get(`/orders/${id}`),

  create: (data: any) => apiService.post("/orders", data),

  update: (id: string, data: any) => apiService.put(`/orders/${id}`, data),

  updateStatus: (id: string, status: string) =>
    apiService.patch(`/orders/${id}/status`, { status }),

  delete: (id: string) => apiService.delete(`/orders/${id}`),
};

export const menuApi = {
  getCategories: () => apiService.get("/menu/categories"),

  getItems: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }) => apiService.get("/menu/items", params),

  createItem: (data: any) => apiService.post("/menu/items", data),

  updateItem: (id: string, data: any) =>
    apiService.put(`/menu/items/${id}`, data),

  deleteItem: (id: string) => apiService.delete(`/menu/items/${id}`),

  uploadImage: (file: File, itemId?: string) =>
    apiService.uploadFile("/menu/upload-image", file, { itemId }),
};

export const customersApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiService.get("/customers", params),

  getById: (id: string) => apiService.get(`/customers/${id}`),

  getReviews: (
    customerId?: string,
    params?: { page?: number; limit?: number }
  ) => apiService.get("/customers/reviews", { customerId, ...params }),
};

export const analyticsApi = {
  getSalesReport: (params?: {
    startDate?: string;
    endDate?: string;
    period?: string;
  }) => apiService.get("/analytics/sales", params),

  getCustomerAnalytics: (params?: { startDate?: string; endDate?: string }) =>
    apiService.get("/analytics/customers", params),

  getMenuPerformance: (params?: { startDate?: string; endDate?: string }) =>
    apiService.get("/analytics/menu", params),

  getRevenueTrends: (params?: { period?: string }) =>
    apiService.get("/analytics/revenue", params),
};

export const authApi = {
  login: (email: string, password: string) =>
    apiService.post("/auth/login", { email, password }),

  logout: () => apiService.post("/auth/logout"),

  refreshToken: () => apiService.post("/auth/refresh"),

  getProfile: () => apiService.get("/auth/profile"),

  updateProfile: (data: any) => apiService.put("/auth/profile", data),
};

// Error handling utility
export const handleApiError = (error: ApiError): string => {
  switch (error.status) {
    case 400:
      return error.message || "Bad request. Please check your input.";
    case 401:
      return "Unauthorized. Please log in again.";
    case 403:
      return "Access denied. You do not have permission to perform this action.";
    case 404:
      return "Resource not found.";
    case 422:
      return error.message || "Validation error. Please check your input.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return error.message || "An unexpected error occurred.";
  }
};
