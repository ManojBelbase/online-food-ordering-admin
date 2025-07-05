import { QueryClient } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Disable retries by default (customize as needed)
      staleTime: 1000 * 60 * 5, // Cache queries for 5 minutes
    },
  },
});

export { queryClient };