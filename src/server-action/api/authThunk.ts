import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { makeRequest } from "../makeRequest";
import Cookies from "js-cookie";

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<
  {
    user: Auth.User;
    token: string;
  },
  LoginCredentials,
  {
    rejectValue: string;
  }
>("auth/loginUser", async ({ email, password }: LoginCredentials, thunkAPI) => {
  try {
    console.log("🚀 Login attempt:", { email, password: "***" });
    console.log("🌐 API URL:", makeRequest.defaults.baseURL);

    // Try different request formats that backends commonly expect
    const loginData = { email, password };

    const res = await makeRequest.post("auth/login", loginData);
    console.log("✅ Login success:", res.data);
    return res.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    console.error("❌ Login error:", {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
      method: error.config?.method
    });

    // Try to extract meaningful error message
    let errorMessage = "Login failed";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data && 'error' in error.response.data) {
      errorMessage = (error.response.data as any).error;
    } else if (error.response?.status === 400) {
      errorMessage = "Invalid email or password format";
    } else if (error.response?.status === 401) {
      errorMessage = "Invalid credentials";
    } else if (error.response?.status === 404) {
      errorMessage = "Login endpoint not found";
    } else if (error.response?.status && error.response.status >= 500) {
      errorMessage = "Server error. Please try again later.";
    }

    return thunkAPI.rejectWithValue(errorMessage);
  }
});

export const logoutAsync = createAsyncThunk<
  void,
  void,
  {
    rejectValue: string;
  }
>("auth/logout", async (_, thunkAPI) => {
  try {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");


    return;
  } catch (err: unknown) {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    return thunkAPI.rejectWithValue("Logout failed");
  }
});
