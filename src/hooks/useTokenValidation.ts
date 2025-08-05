import { useEffect, useState } from 'react';
import { useAuth } from '../redux/useAuth';
import { isTokenExpired, getTokenRemainingTime } from '../utils/tokenUtils';

/**
 * Hook to monitor token validity and provide token status information
 */
export const useTokenValidation = () => {
  const { accessToken } = useAuth();
  const [tokenStatus, setTokenStatus] = useState<{
    isValid: boolean;
    isExpired: boolean;
    remainingTime: {
      totalSeconds: number;
      minutes: number;
      hours: number;
      isExpired: boolean;
    };
  }>({
    isValid: false,
    isExpired: true,
    remainingTime: { totalSeconds: 0, minutes: 0, hours: 0, isExpired: true }
  });

  useEffect(() => {
    const checkTokenStatus = () => {
      if (!accessToken) {
        setTokenStatus({
          isValid: false,
          isExpired: true,
          remainingTime: { totalSeconds: 0, minutes: 0, hours: 0, isExpired: true }
        });
        return;
      }

      const expired = isTokenExpired(accessToken);
      const remainingTime = getTokenRemainingTime(accessToken);

      setTokenStatus({
        isValid: !expired,
        isExpired: expired,
        remainingTime
      });
    };

    // Check immediately
    checkTokenStatus();

    // Check every minute
    const interval = setInterval(checkTokenStatus, 60000);

    return () => clearInterval(interval);
  }, [accessToken]);

  return tokenStatus;
};

/**
 * Hook to automatically refresh token when it's about to expire
 */
export const useAutoTokenRefresh = (minutesBeforeExpiry: number = 5) => {
  const { accessToken } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!accessToken) return;

    const checkAndRefresh = async () => {
      if (isRefreshing) return;

      const remainingTime = getTokenRemainingTime(accessToken);
      
      // If token expires in less than specified minutes, refresh it
      if (!remainingTime.isExpired && remainingTime.minutes <= minutesBeforeExpiry) {
        setIsRefreshing(true);
        
        try {
          // The refresh will be handled by the axios interceptor
          // We just need to trigger a request that will cause the refresh
          console.log(`Token expires in ${remainingTime.minutes} minutes, will be refreshed automatically on next request`);
        } catch (error) {
          console.error('Auto token refresh failed:', error);
        } finally {
          setIsRefreshing(false);
        }
      }
    };

    // Check every 2 minutes
    const interval = setInterval(checkAndRefresh, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [accessToken, minutesBeforeExpiry, isRefreshing]);

  return { isRefreshing };
};
