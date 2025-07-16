import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../../server-action/authSlice";
import { authApi } from "../../server-action/api/authApi";

export const rootReducer = combineReducers({
  // Authentication
  auth: authReducer,

  // APIs
  [authApi.reducerPath]: authApi.reducer,

  // 🚀 Future feature reducers (uncomment when needed)
  // orders: ordersReducer,
  // menu: menuReducer,
  // customers: customersReducer,
  // analytics: analyticsReducer,
  // notifications: notificationsReducer,
  // settings: settingsReducer,
});

// Export the root state type
export type RootState = ReturnType<typeof rootReducer>;
