import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import type { Auth } from "../types/auth";
import { makeRequest } from "./makeRequest";

interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name:string,
  email: string;
  password: string;
  role: string;
}

export const loginUser = createAsyncThunk<
  {
    user: Auth.User;
    accessToken: string;
  },
  LoginCredentials,
  {
    rejectValue: string;
  }
>("auth/loginUser", async ({ email, password }: LoginCredentials, thunkAPI) => {
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
      return res.data;
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Signup failed"
      );
    }
  }
);
