import { createSlice } from "@reduxjs/toolkit";
import type { Auth } from "../../types/auth";
import { loginUser, signupUser } from "../../server-action/api/authThunk";

const initialState: Auth.AuthState = {
  user: null,
  accessToken: null,
  loadingLogin: false,
  loadingSignup: false,
  errorLogin: null,
  errorSignup: null,
  isInitialized: false,
};

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
      // Remove accessToken from localStorage
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
        // Store accessToken in localStorage
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
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.loadingSignup = false;
        // Store accessToken in localStorage
        localStorage.setItem("accessToken", action.payload.accessToken);
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
