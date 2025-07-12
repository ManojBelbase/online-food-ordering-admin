import { useState, useCallback } from 'react';

interface ApiTableParams {
  search?: string;
  filters?: Record<string, any>;
  sort?: { column: string; direction: 'asc' | 'desc' };
  page?: number;
  limit?: number;
}

interface UseApiTableOptions {
  initialParams?: Partial<ApiTableParams>;
  onParamsChange?: (params: ApiTableParams) => void;
}

export const useApiTable = (options: UseApiTableOptions = {}) => {
  const {
    initialParams = {},
    onParamsChange,
  } = options;

  const [params, setParams] = useState<ApiTableParams>({
    search: '',
    filters: {},
    sort: { column: '', direction: 'asc' },
    page: 1,
    limit: 25,
    ...initialParams,
  });

  // Update params and notify parent
  const updateParams = useCallback((newParams: Partial<ApiTableParams>) => {
    const updatedParams = { ...params, ...newParams };
    setParams(updatedParams);
    onParamsChange?.(updatedParams);
  }, [params, onParamsChange]);

  // API handlers for DataTable
  const apiHandlers = {
    onApiSearch: useCallback((query: string) => {
      updateParams({ search: query, page: 1 });
    }, [updateParams]),

    onApiFilter: useCallback((filters: Record<string, any>) => {
      updateParams({ filters, page: 1 });
    }, [updateParams]),

    onApiSort: useCallback((column: string, direction: 'asc' | 'desc') => {
      updateParams({ sort: { column, direction }, page: 1 });
    }, [updateParams]),

    onPageChange: useCallback((page: number) => {
      updateParams({ page });
    }, [updateParams]),

    onLimitChange: useCallback((limit: number) => {
      updateParams({ limit, page: 1 });
    }, [updateParams]),
  };

  // Reset functions
  const resetSearch = useCallback(() => {
    updateParams({ search: '', page: 1 });
  }, [updateParams]);

  const resetFilters = useCallback(() => {
    updateParams({ filters: {}, page: 1 });
  }, [updateParams]);

  const resetAll = useCallback(() => {
    updateParams({
      search: '',
      filters: {},
      sort: { column: '', direction: 'asc' },
      page: 1,
    });
  }, [updateParams]);

  return {
    params,
    apiHandlers,
    updateParams,
    resetSearch,
    resetFilters,
    resetAll,
  };
};

// Example usage with RTK Query
export const useOrdersTable = () => {
  const { params, apiHandlers, resetAll } = useApiTable({
    initialParams: {
      limit: 25,
      sort: { column: 'createdAt', direction: 'desc' },
    },
  });

  // This would be your actual API call
  // const { data: orders, loading } = useGetOrdersQuery(params);

  const tableProps = {
    // data: orders?.data || [],
    // pagination: {
    //   page: params.page || 1,
    //   limit: params.limit || 25,
    //   total: orders?.total || 0,
    //   totalPages: orders?.totalPages || 0,
    // },
    // loading,
    
    // API integration
    apiMode: true,
    currentSearch: params.search,
    currentFilters: params.filters,
    currentSort: params.sort,
    ...apiHandlers,
  };

  return {
    tableProps,
    params,
    resetAll,
  };
};
