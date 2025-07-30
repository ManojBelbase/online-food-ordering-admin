import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../../server-action/api/authApi";
import authReducer from '../../server-action/authSlice'
export const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;