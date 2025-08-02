import { combineReducers } from "@reduxjs/toolkit";
import authReducer from '../../server-action/authSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof rootReducer>;