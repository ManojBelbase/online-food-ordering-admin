import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../redux/store/store';

export const API_TAGS = {
  Auth: 'Auth',
  Menu: 'Menu',
  Customers: 'Customers',
  Analytics: 'Analytics',
} as const;

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'https://food-ordering-backend-axbt.onrender.com/api/v1/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
    fetchFn: async (input, init) => {
      const startTime = Date.now();
      
      try {
        const response = await fetch(input, init);
        const endTime = Date.now();
        
        if (process.env.NODE_ENV === 'development' && endTime - startTime > 1000) {
          console.warn(`🐌 Slow API request: ${input} took ${endTime - startTime}ms`);
        }
        
        return response;
      } catch (error) {
        console.error('🚨 API request failed:', error);
        throw error;
      }
    },
  }),
  
  tagTypes: Object.values(API_TAGS),
  
  // Keep cache for 5 minutes by default
  keepUnusedDataFor: 300,
  
  refetchOnReconnect: true,
  refetchOnFocus: false, // Disable for better performance
  
  endpoints: () => ({}),
});

// Enhanced base query with retry logic
const baseQueryWithRetry = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'https://food-ordering-backend-axbt.onrender.com/api/v1/',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('content-type', 'application/json');
    return headers;
  },
});

export const enhancedBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const result = await baseQueryWithRetry(args, api, extraOptions);

      if (result.error) {
        const status = result.error.status;

        if (typeof status === 'number' && status >= 400 && status < 500) {
          return result;
        }

        // Retry on server errors (5xx) or network errors
        if (attempt < maxRetries - 1) {
          attempt++;
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
      }

      return result;
    } catch (error) {
      if (attempt < maxRetries - 1) {
        attempt++;
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      throw error;
    }
  }
};

// Export hooks for components
export const {
  // Will be populated by individual API slices
} = baseApi;
