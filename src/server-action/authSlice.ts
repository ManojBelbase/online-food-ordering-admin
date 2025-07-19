import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { makeRequest } from "./makeRequest";
import type { Auth } from "../types/auth";

const initialState: Auth.AuthState = {
  user: null,
  accessToken: null,
  loadingLogin: false,
  loadingSignup: false,
  errorLogin: null,
  errorSignup: null,
  isInitialized: false,
};

// Define thunks in the same file
export const loginUser = createAsyncThunk<
  { user: Auth.User; accessToken: string },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, thunkAPI) => {
  try {
    const res = await makeRequest.post("auth/login", { email, password });
    return res.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Login failed"
    );
  }
});

export const signupUser = createAsyncThunk<
  { user: Auth.User; accessToken: string },
  { email: string; password: string; role: string },
  { rejectValue: string }
>("auth/signupUser", async ({ email, password, role }, thunkAPI) => {
  try {
    const res = await makeRequest.post("auth/signup", { email, password, role });
    return res.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Signup failed"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loadingLogin = false;
      state.loadingSignup = false;
      state.errorLogin = null;
      state.errorSignup = null;
      localStorage.removeItem("accessToken");
    },
    clearSignupError: (state) => {
      state.errorSignup = null;
    },
    clearLoginError: (state) => {
      state.errorLogin = null;
    },
    initializeAuth: (state) => {
      state.isInitialized = true;
    },
    refreshToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      localStorage.setItem("accessToken", action.payload.accessToken);
    },
  },
  extraReducers: (builder) => {
    // Login User
    builder
      .addCase(loginUser.pending, (state) => {
        state.loadingLogin = true;
        state.errorLogin = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.loadingLogin = false;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loadingLogin = false;
        state.errorLogin = action.payload || "Unknown error occurred";
      });

    // Signup User
    builder
      .addCase(signupUser.pending, (state) => {
        state.loadingSignup = true;
        state.errorSignup = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loadingSignup = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loadingSignup = false;
        state.errorSignup = action.payload || "Unknown error occurred";
      });
  },
});

export const {
  logout,
  clearSignupError,
  clearLoginError,
  initializeAuth,
  refreshToken,
} = authSlice.actions;
export default authSlice.reducer;