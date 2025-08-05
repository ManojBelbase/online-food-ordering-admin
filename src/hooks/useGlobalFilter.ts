import { useState, useCallback } from 'react';

/**
 * Global filter hook that provides consistent filter handling across all pages
 * @param initialFilters - Initial filter values (optional)
 * @returns Object containing filter state and handlers
 */
export const useGlobalFilter = (initialFilters: Record<string, any> = {}) => {
  const [filterValues, setFilterValues] = useState<Record<string, any>>(initialFilters);

  /**
   * Handle filter changes - can be used directly with DataTable onFiltersChange prop
   * @param filters - New filter values
   */
  const handleFiltersChange = useCallback((filters: Record<string, any>) => {
    setFilterValues(filters);
  }, []);

  /**
   * Update a specific filter value
   * @param key - Filter key
   * @param value - Filter value
   */
  const updateFilter = useCallback((key: string, value: any) => {
    setFilterValues(prev => {
      const newFilters = { ...prev };
      if (value === null || value === "" || value === undefined) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilterValues({});
  }, []);

  /**
   * Clear a specific filter
   * @param key - Filter key to clear
   */
  const clearFilter = useCallback((key: string) => {
    setFilterValues(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  /**
   * Set multiple filters at once
   * @param filters - Object containing filter key-value pairs
   */
  const setFilters = useCallback((filters: Record<string, any>) => {
    setFilterValues(filters);
  }, []);

  /**
   * Get the current value of a specific filter
   * @param key - Filter key
   * @returns Filter value or undefined
   */
  const getFilterValue = useCallback((key: string) => {
    return filterValues[key];
  }, [filterValues]);

  /**
   * Check if any filters are active
   * @returns Boolean indicating if filters are applied
   */
  const hasActiveFilters = useCallback(() => {
    return Object.keys(filterValues).length > 0;
  }, [filterValues]);

  /**
   * Get count of active filters
   * @returns Number of active filters
   */
  const getActiveFilterCount = useCallback(() => {
    return Object.keys(filterValues).length;
  }, [filterValues]);

  /**
   * Check if a specific filter is active
   * @param key - Filter key
   * @returns Boolean indicating if the filter is active
   */
  const isFilterActive = useCallback((key: string) => {
    return filterValues[key] !== undefined && filterValues[key] !== null && filterValues[key] !== '';
  }, [filterValues]);

  return {
    // State
    filterValues,
    
    // Main handler (use this with DataTable)
    handleFiltersChange,
    
    // Individual filter operations
    updateFilter,
    clearFilter,
    getFilterValue,
    isFilterActive,
    
    // Bulk operations
    setFilters,
    clearFilters,
    
    // Utility functions
    hasActiveFilters,
    getActiveFilterCount,
  };
};

/**
 * Type definition for the return value of useGlobalFilter
 */
export type GlobalFilterReturn = ReturnType<typeof useGlobalFilter>;
