import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { rootReducer } from '../reducers';
import { authApi } from '../../server-action/api/authApi';

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
  blacklist: [authApi.reducerPath], 
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 🚀 Store Configuration
export const appStore = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 128,
      },
      immutableCheck: { warnAfter: 128 },
    }).concat(authApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(appStore);

// 🎯 Export types (re-export from reducers for consistency)
export type { RootState } from '../reducers';
export type AppDispatch = typeof appStore.dispatch;
