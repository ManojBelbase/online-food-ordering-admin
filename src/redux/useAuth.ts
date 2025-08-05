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

    // Initialize auth state and validate token on app startup
    const initializeAuthState = async () => {
      if (!auth.isInitialized) {
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          try {
            // Try to refresh the token to validate it
            const { data } = await axios.post(
              `${import.meta.env.VITE_REACT_APP_API_URL}/auth/refresh-token`,
              {},
              { withCredentials: true }
            );

            // Token is valid, update the state
            dispatch(refreshToken({
              user: data.user,
              accessToken: data.accessToken
            }));
          } catch (error) {
            // Token is invalid, clear auth state
            console.log('Token validation failed, logging out');
            dispatch(logout());
          }
        }

        dispatch(initializeAuth());
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