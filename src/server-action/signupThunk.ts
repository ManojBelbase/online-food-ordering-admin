import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import type { Auth } from "../types/auth";
import { makeRequest } from "./makeRequest";

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const signupUser = createAsyncThunk<
  {
    user: Auth.User;
    accessToken: string;
  },
  SignupCredentials,
  {
    rejectValue: string;
  }
>(
  "auth/signupUser",
  async ({name, email, password, role }: SignupCredentials, thunkAPI) => {
    try {
      console.log('🚀 Attempting signup with:', { name, email, role });
      console.log('🌐 API URL:', import.meta.env.VITE_REACT_APP_API_URL);

      const res = await makeRequest.post("auth/signup", {
        name,
        email,
        password,
        role,
      },{
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log('✅ Signup successful:', res.data);
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      console.error('❌ Signup failed:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Signup failed"
      );
    }
  }
);
