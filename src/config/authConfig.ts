/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  // Frontend token validation settings
  ENABLE_FRONTEND_TOKEN_CHECK: true, // Set to false for backend-only validation
  TOKEN_REFRESH_BUFFER_MINUTES: 5,   // Refresh token X minutes before expiry
  ENABLE_PROACTIVE_REFRESH: true,    // Refresh tokens in background before expiry
  
  // Debug settings
  ENABLE_TOKEN_DEBUG: import.meta.env.DEV, // Show token status in development
  LOG_TOKEN_EVENTS: import.meta.env.DEV,   // Log token refresh events
  
  // Fallback settings
  MAX_REFRESH_RETRIES: 3,            // Max attempts to refresh token
  REFRESH_RETRY_DELAY: 1000,         // Delay between refresh attempts (ms)
} as const;

export type AuthConfig = typeof AUTH_CONFIG;
