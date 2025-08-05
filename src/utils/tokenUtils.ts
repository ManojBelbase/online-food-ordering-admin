
/**
 * Decode JWT token payload without verification
 * @param token - JWT token string
 * @returns Decoded payload or null if invalid
 */
export const decodeJWTPayload = (token: string): any | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * @param token - JWT token string
 * @returns true if token is expired, false otherwise
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) {
    return true; // Consider invalid tokens as expired
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

/**
 * Check if token will expire within the specified minutes
 * @param token - JWT token string
 * @param minutesBeforeExpiry - Minutes before expiry to consider as "expiring soon"
 * @returns true if token will expire soon
 */
export const isTokenExpiringSoon = (token: string, minutesBeforeExpiry: number = 5): boolean => {
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) {
    return true;
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  const expiryBuffer = minutesBeforeExpiry * 60; // Convert to seconds
  return payload.exp < (currentTime + expiryBuffer);
};

/**
 * Get token expiry time as Date object
 * @param token - JWT token string
 * @returns Date object or null if invalid
 */
export const getTokenExpiryDate = (token: string): Date | null => {
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) {
    return null;
  }
  
  return new Date(payload.exp * 1000);
};

/**
 * Get remaining time until token expires
 * @param token - JWT token string
 * @returns Object with remaining time in different units
 */
export const getTokenRemainingTime = (token: string): {
  totalSeconds: number;
  minutes: number;
  hours: number;
  isExpired: boolean;
} => {
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) {
    return { totalSeconds: 0, minutes: 0, hours: 0, isExpired: true };
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  const remainingSeconds = payload.exp - currentTime;
  
  if (remainingSeconds <= 0) {
    return { totalSeconds: 0, minutes: 0, hours: 0, isExpired: true };
  }
  
  return {
    totalSeconds: remainingSeconds,
    minutes: Math.floor(remainingSeconds / 60),
    hours: Math.floor(remainingSeconds / 3600),
    isExpired: false
  };
};
