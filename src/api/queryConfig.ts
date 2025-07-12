import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { notifications } from '@mantine/notifications';
import { apiClient } from "../utils/ApiGateway";
import { PostErrorConfig } from "./Error_Config";

// Default query options
export const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
};

// Create QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: defaultQueryOptions,
    mutations: {
      retry: false,
      onMutate: () => {
        // Dismiss any existing notifications
        notifications.clean();
      },
    },
  },
});

// Generic API response interface
interface ApiResponse<T> {
  data: T;
  message?: string;
  success?: boolean;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}

// Pagination parameters
interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Generic API configuration factory for CRUD operations
 * @param entityName - The name of the entity (used in API paths and query keys)
 * @param entityNameFormatted - The formatted name for toast messages
 * @param additionalQueriesToInvalidate - Additional query keys to invalidate on mutations
 * @returns Object containing all the CRUD operation hooks for the entity
 */
export function createApiConfig<T extends Record<string, any>>(
  entityName: string,
  entityNameFormatted: string,
  additionalQueriesToInvalidate: string[] = []
) {
  /**
   * Invalidate related queries after mutations
   */
  const invalidateQueries = (queryClient: QueryClient) => {
    // Always invalidate the primary entity
    queryClient.invalidateQueries({ queryKey: [entityName] });

    // Invalidate each additional query key if provided
    if (additionalQueriesToInvalidate.length > 0) {
      additionalQueriesToInvalidate.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      });
    }
  };

  /**
   * GET all entities with optional query parameters
   */
  const useGetAll = (
    queryParams?: PaginationParams & Record<string, any>,
    options?: Partial<UseQueryOptions<ApiResponse<T[]>, Error>>
  ) => {
    // Create a stable query key by stringifying the params
    const stableQueryKey = queryParams ? JSON.stringify(queryParams) : "all";

    return useQuery({
      queryKey: [entityName, stableQueryKey],
      queryFn: async (): Promise<ApiResponse<T[]>> => {
        const response = await apiClient.get(`/${entityName}`, {
          params: queryParams,
        });
        return response.data;
      },
      ...options,
    });
  };

  /**
   * GET entity by ID
   */
  const useGetById = (
    id: string | undefined,
    options?: Partial<UseQueryOptions<T, Error>>
  ) => {
    return useQuery({
      queryKey: [entityName, id],
      queryFn: async (): Promise<T> => {
        if (!id) throw new Error('ID is required');
        const response = await apiClient.get(`/${entityName}/${id}`);
        return response.data?.data || response.data;
      },
      enabled: !!id,
      ...options,
    });
  };

  /**
   * CREATE entity
   */
  const useCreate = (
    options?: any
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (entityData: T) => {
        const response = await apiClient.post(`/${entityName}`, entityData);
        return response.data;
      },
      onSuccess: (data, variables) => {
        invalidateQueries(queryClient);
        notifications.show({
          title: 'Success',
          message: `${entityNameFormatted} created successfully`,
          color: 'green',
        });
        options?.onSuccess?.(data, variables, undefined);
      },
      onError: (error: any, variables) => {
        const errorMessage = PostErrorConfig({ error, entityNameFormatted });
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
        options?.onError?.(error, variables, undefined);
      },
      ...options,
    });
  };

  /**
   * UPDATE entity
   */
  const useUpdate = (
    options?: any
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async ({ entityData, id }: { entityData: Partial<T>; id: string }) => {
        const response = await apiClient.patch(`/${entityName}/${id}`, entityData);
        return response.data;
      },
      onSuccess: (data, variables) => {
        invalidateQueries(queryClient);
        notifications.show({
          title: 'Success',
          message: `${entityNameFormatted} updated successfully`,
          color: 'green',
        });
        options?.onSuccess?.(data, variables, undefined);
      },
      onError: (error: any, variables) => {
        const errorMessage = PostErrorConfig({ error, entityNameFormatted });
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
        options?.onError?.(error, variables, undefined);
      },
      ...options,
    });
  };

  /**
   * DELETE entity by ID
   */
  const useDelete = (
    options?: any
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (id: string) => {
        const response = await apiClient.delete(`/${entityName}/${id}`);
        return response.data;
      },
      onSuccess: (data, variables) => {
        invalidateQueries(queryClient);
        notifications.show({
          title: 'Success',
          message: `${entityNameFormatted} deleted successfully`,
          color: 'green',
        });
        options?.onSuccess?.(data, variables, undefined);
      },
      onError: (error: any, variables) => {
        const errorMessage = PostErrorConfig({ error, entityNameFormatted });
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
        options?.onError?.(error, variables, undefined);
      },
      ...options,
    });
  };

  /**
   * DELETE entities by query parameters
   */
  const useDeleteByQuery = (
    queryParams?: Record<string, any>,
    options?: any
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async () => {
        const response = await apiClient.delete(`/${entityName}`, {
          params: queryParams,
        });
        return response.data;
      },
      onSuccess: (data, variables) => {
        invalidateQueries(queryClient);
        notifications.show({
          title: 'Success',
          message: `${entityNameFormatted} deleted successfully`,
          color: 'green',
        });
        options?.onSuccess?.(data, variables, undefined);
      },
      onError: (error: any, variables) => {
        const errorMessage = PostErrorConfig({ error, entityNameFormatted });
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
        options?.onError?.(error, variables, undefined);
      },
      ...options,
    });
  };

  /**
   * DELETE entities with dynamic query parameters
   */
  const useDeleteWithQuery = (
    options?: any
  ) => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: async (queryParams: Record<string, any>) => {
        const response = await apiClient.delete(`/${entityName}`, {
          params: queryParams,
        });
        return response.data;
      },
      onSuccess: (data, variables) => {
        invalidateQueries(queryClient);
        notifications.show({
          title: 'Success',
          message: `${entityNameFormatted} deleted successfully`,
          color: 'green',
        });
        options?.onSuccess?.(data, variables, undefined);
      },
      onError: (error: any, variables) => {
        const errorMessage = PostErrorConfig({ error, entityNameFormatted });
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
        options?.onError?.(error, variables, undefined);
      },
      ...options,
    });
  };

  return {
    useGetAll,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
    useDeleteByQuery,
    useDeleteWithQuery,
  };
}
