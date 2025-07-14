import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAuth = () => {
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  let user = auth.user;
  if (typeof auth.user === 'string') {
    try {
      user = JSON.parse(auth.user);
    } catch {
      user = null;
    }
  }

  const isAuthenticated = !!(user && typeof user === 'object' && (user._id || user.id));

  return {
    ...auth,
    user,
    isAuthenticated,
    isLoading: auth.loadingLogin,
    dispatch,
  };
};


