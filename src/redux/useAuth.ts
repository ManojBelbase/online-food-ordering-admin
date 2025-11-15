import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from './store/store';
import { faceLoginUser, loginUser, refreshToken, logout, initializeAuth } from '../server-action/authSlice';
import type { Auth } from '../types/auth';
import axios from 'axios';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleRefreshToken = (event: Event) => {
      const { user, accessToken } = (event as CustomEvent).detail;
      dispatch(refreshToken({ user, accessToken }));
    };

    const handleLogout = () => {
      dispatch(logout());
    };

    // Initialize auth state immediately (don't block on token refresh)
    const initializeAuthState = async () => {
      if (!auth.isInitialized) {
        // Set initialized immediately so app doesn't hang
        dispatch(initializeAuth());

        // Try to refresh token in background (non-blocking)
        const storedToken = localStorage.getItem("accessToken");
        if (storedToken) {
          // Don't await - let it run in background
          axios.post(
            `${import.meta.env.VITE_REACT_APP_API_URL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          )
            .then(({ data }) => {
              // Token is valid, update the state
              dispatch(refreshToken({
                user: data.user,
                accessToken: data.accessToken
              }));
            })
            .catch(() => {
              // Token is invalid, clear auth state silently
              // Don't log to avoid console spam on first load
              dispatch(logout());
            });
        }
      }
    };

    initializeAuthState();

    window.addEventListener("auth:refreshToken", handleRefreshToken);
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:refreshToken", handleRefreshToken);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [dispatch, auth.isInitialized]);

  let user: Auth.User | null = auth.user;
  if (typeof auth.user === 'string') {
    try {
      user = JSON.parse(auth.user);
    } catch {
      user = null;
    }
  }

  const isAuthenticated = !!(user && typeof user === 'object' && (user._id || user.id));

  const login = async (
    credentials: { email: string; password: string } | { faceDescriptor: number[] }
  ) => {
    if ('faceDescriptor' in credentials) {
      return dispatch(faceLoginUser({ faceDescriptor: credentials.faceDescriptor }));
    } else {
      return dispatch(loginUser({ email: credentials.email, password: credentials.password }));
    }
  };

  return {
    ...auth,
    user,
    isAuthenticated,
    isLoading: auth.loadingLogin,
    login,
    dispatch,
  };
};