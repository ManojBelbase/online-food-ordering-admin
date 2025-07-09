import { useEffect, useRef, useState, useCallback } from 'react';

interface UseOptimizedQueryOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  staleTime?: number;
  cacheTime?: number;
  retry?: number;
  retryDelay?: number;
}

interface QueryState<T> {
  data: T | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isFetching: boolean;
  isStale: boolean;
}

// Cache for storing query results
const queryCache = new Map<string, {
  data: any;
  timestamp: number;
  staleTime: number;
}>();

export function useOptimizedQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>,
  options: UseOptimizedQueryOptions = {}
): QueryState<T> & {
  refetch: () => Promise<void>;
  invalidate: () => void;
} {
  const {
    enabled = true,
    refetchOnWindowFocus = false,
    refetchInterval,
    staleTime = 5 * 60 * 1000, // 5 minutes
    retry = 3,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<QueryState<T>>({
    data: undefined,
    isLoading: false,
    isError: false,
    error: null,
    isFetching: false,
    isStale: false,
  });

  const retryCount = useRef(0);
  const abortController = useRef<AbortController | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Create cache key
  const cacheKey = queryKey.join('|');

  // Check if data is in cache and not stale
  const getCachedData = useCallback(() => {
    const cached = queryCache.get(cacheKey);
    if (cached) {
      const isStale = Date.now() - cached.timestamp > cached.staleTime;
      return { data: cached.data, isStale };
    }
    return null;
  }, [cacheKey]);

  // Execute query with retry logic
  const executeQuery = useCallback(async (isRefetch = false) => {
    if (!enabled) return;

    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();

    setState(prev => ({
      ...prev,
      isLoading: !isRefetch && !prev.data,
      isFetching: true,
      isError: false,
      error: null,
    }));

    try {
      const data = await queryFn();
      
      // Cache the result
      queryCache.set(cacheKey, {
        data,
        timestamp: Date.now(),
        staleTime,
      });

      setState(prev => ({
        ...prev,
        data,
        isLoading: false,
        isFetching: false,
        isStale: false,
      }));

      retryCount.current = 0;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled
      }

      retryCount.current++;

      if (retryCount.current < retry) {
        // Retry with exponential backoff
        setTimeout(() => {
          executeQuery(isRefetch);
        }, retryDelay * Math.pow(2, retryCount.current - 1));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          isFetching: false,
          isError: true,
          error: error as Error,
        }));
        retryCount.current = 0;
      }
    }
  }, [enabled, queryFn, cacheKey, staleTime, retry, retryDelay]);

  // Refetch function
  const refetch = useCallback(async () => {
    await executeQuery(true);
  }, [executeQuery]);

  // Invalidate cache
  const invalidate = useCallback(() => {
    queryCache.delete(cacheKey);
    setState(prev => ({ ...prev, isStale: true }));
  }, [cacheKey]);

  // Initial fetch
  useEffect(() => {
    if (!enabled) return;

    // Check cache first
    const cached = getCachedData();
    if (cached) {
      setState(prev => ({
        ...prev,
        data: cached.data,
        isStale: cached.isStale,
      }));

      // If data is stale, fetch fresh data
      if (cached.isStale) {
        executeQuery();
      }
    } else {
      executeQuery();
    }
  }, [enabled, executeQuery, getCachedData]);

  // Refetch on window focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      const cached = getCachedData();
      if (cached?.isStale) {
        executeQuery(true);
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, executeQuery, getCachedData]);

  // Polling
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    intervalRef.current = setInterval(() => {
      executeQuery(true);
    }, refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, enabled, executeQuery]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortController.current) {
        abortController.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    invalidate,
  };
}

// Hook for infinite queries (pagination)
export function useInfiniteQuery<T>(
  queryKey: string[],
  queryFn: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
  options: UseOptimizedQueryOptions = {}
) {
  const [pages, setPages] = useState<T[][]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const currentPage = useRef(1);

  const fetchPage = useCallback(async (page: number) => {
    try {
      const result = await queryFn(page);
      return result;
    } catch (error) {
      throw error;
    }
  }, [queryFn]);

  const baseQuery = useOptimizedQuery(
    [...queryKey, 'page', currentPage.current.toString()],
    () => fetchPage(currentPage.current),
    options
  );

  const fetchNextPage = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const result = await fetchPage(currentPage.current + 1);
      setPages(prev => [...prev, result.data]);
      setHasNextPage(result.hasMore);
      currentPage.current++;
    } catch (error) {
      console.error('Failed to fetch next page:', error);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [hasNextPage, isFetchingNextPage, fetchPage]);

  // Initialize first page
  useEffect(() => {
    if (baseQuery.data) {
      setPages([baseQuery.data.data]);
      setHasNextPage(baseQuery.data.hasMore);
    }
  }, [baseQuery.data]);

  const flatData = pages.flat();

  return {
    data: flatData,
    isLoading: baseQuery.isLoading,
    isError: baseQuery.isError,
    error: baseQuery.error,
    isFetching: baseQuery.isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch: baseQuery.refetch,
  };
}
