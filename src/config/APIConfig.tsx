import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "./ApiGateway";
import { PostErrorConfig } from "./Error_Config";
import { notifications } from "@mantine/notifications";


/**
 * @param entityName - The name of the entity (used in API paths and query keys)
 * @param entityNameFormatted - The formatted name for toast messages
 * @param additionalQueriesToInvalidate - Additional query keys to invalidate on mutations
 * @returns Object containing all the CRUD operation hooks for the entity
 */
export function createApiConfig<T>(
  entityName: string,
  entityNameFormatted: string,
  additionalQueriesToInvalidate: string[] = []
) {
  /**
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

  // GET all entities
  const useGetAll = (
    queryParams?: Record<string, any>,
    options?: Partial<UseQueryOptions<T[], Error>>
  ) => {
    const stableQueryKey = queryParams ? JSON.stringify(queryParams) : "all";

    return useQuery({
      queryKey: [entityName, stableQueryKey],
      queryFn: async () => {
        const response = await apiClient.get(`/${entityName}`, {
          params: queryParams,
        });

        return response.data;
      },
      ...options,
    });
  };

  // GET entity by ID
  const useGetById = (id: string) => {
    return useQuery({
      queryKey: [entityName, id],
      queryFn: async () => {
        const { data } = await apiClient.get(`/${entityName}/${id}`);
        return data;
      },
      enabled: !!id,
    });
  };

  // CREATE entity
  const useCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (entityData: T) => {
        return apiClient.post(`${entityName}`, entityData);
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        notifications.show({
          title: "Success",
          message: `${entityNameFormatted} Created Successfully`,
          color: "green",
        });
      },
      onError: (error: any) => {

        // Extract the actual error message from the API response
        let actualErrorMessage = `Error Creating ${entityNameFormatted}`;
        

        if (error?.response?.data?.error?.message) {
          // Handle structure: {"success":false,"error":{"message":"Name already exists","status":400}}
          actualErrorMessage = error.response.data.error.message;
        } else if (error?.response?.data?.message) {
          // Handle structure: {"message": "Some error"}
          actualErrorMessage = error.response.data.message;
        } else if (error?.message) {
          // Handle direct error message
          actualErrorMessage = error.message;
        } else if (error?.response){
          actualErrorMessage=error?.response?.data?.error?.message
        }

        const errorMessage = PostErrorConfig({ error: actualErrorMessage, entityNameFormatted });
        notifications.show({
          title: "Error",
          message: errorMessage,
          color: "red",
        });
      },
      retry: false,
      onMutate: () => {
        notifications.clean();
      },
    });
  };

  // UPDATE entity
  const useUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({
        entityData,
        _id,
      }: {
        entityData: T;
        _id: string;
      }) => {
        try {
          const response = await apiClient.patch(
            `${entityName}/${_id}`,
            entityData
          );
          return response.data;
        } catch (err) {
          console.log("Original error in mutationFn:", err);
          throw err;
        }
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        notifications.show({
          title: "Success",
          message: `${entityNameFormatted} Updated Successfully`,
          color: "green",
        });
      },
      onError: (error: any) => {
        console.log("Error type:", typeof error);
        console.log("Full error:", error);

        console.log(error?.error, "errorsssss");

        // Handle string error
        if (typeof error === "string") {
          notifications.show({
            title: "Error",
            message: error,
            color: "red",
          });
          return;
        }

        // Handle string error
        if (typeof error === "string") {
          notifications.show({
            title: "Error",
            message: error,
            color: "red",
          });
          return;
        }

        // Handle string error
        if (typeof error === "string") {
            console.log("String error:", error);
          notifications.show({
    title: "Error",
    message: error,
    color: "red",
  });
  return;
}

        // Handle axios error
        if (error.response?.data) {
          const errorData = error.response.data;
          console.log("Error response data:", errorData);

          // Try to get the duplicate entry message
          if (
            errorData.error &&
            Array.isArray(errorData.error) &&
            errorData.error.length > 0
          ) {
            notifications.show({
              title: "Error",
              message: errorData.error[0].message,
              color: "red",
            });
            return;
          }

          // Fallback to general message
          if (errorData.message) {
            notifications.show({
              title: "Error",
              message: errorData.message,
              color: "red",
            });
            return;
          }
        }

        // Direct access attempt if the error might be the response itself
        if (
          error.error &&
          Array.isArray(error.error) &&
          error.error.length > 0
        ) {
          notifications.show({
            title: "Error",
            message: error.error[0].message,
            color: "red",
          });
          return;
        }

        // Last resort
        notifications.show({
          title: "Error",
          message: `Error Updating ${entityNameFormatted}`,
          color: "red",
        });
      },
      retry: false,
      onMutate: () => {
        notifications.clean();
      },
    });
  };

  // DELETE entity
  const useDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id: string) => {
        await apiClient.delete(`${entityName}/${id}`);
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        notifications.show({
          title: "Success",
          message: `${entityNameFormatted} Deleted Successfully`,
          color: "green",
        });
      },
      onError: () => {
        notifications.show({
          title: "Error",
          message: `Error Deleting ${entityNameFormatted}`,
          color: "red",
        });
      },
    });
  };

  const useDeleteByQuery = (queryParams?: Record<string, any>) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async () => {
        await apiClient.delete(`${entityName}`, {
          params: queryParams,
        });
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        notifications.show({
          title: "Success",
          message: `${entityNameFormatted} Deleted Successfully`,
          color: "green",
        });
      },
      onError: () => {
        notifications.show({
          title: "Error",
          message: `Error Deleting ${entityNameFormatted}`,
          color: "red",
        });
      },
    });
  };

  const useDeleteWithQuery = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (queryParams?: Record<string, any>) => {
        await apiClient.delete(`${entityName}`, {
          params: queryParams,
        });
      },
      onSuccess: () => {
        invalidateQueries(queryClient);
        notifications.show({
          title: "Success",
          message: `${entityNameFormatted} Deleted Successfully`,
          color: "green",
        });
      },
      onError: () => {
        notifications.show({
          title: "Error",
          message: `Error Deleting ${entityNameFormatted}`,
          color: "red",
        });
      },
    });
  };

  return {
    useGetAll,
    useDeleteByQuery,
    useDeleteWithQuery,
    useGetById,
    useCreate,
    useUpdate,
    useDelete,
  };
}