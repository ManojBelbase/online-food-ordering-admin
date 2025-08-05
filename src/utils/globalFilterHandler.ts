/**
 * Global Filter Handler Utility
 * Simple function that you can import and use directly in any page
 */

/**
 * Global handleFiltersChange function
 * @param filters - The new filter values
 * @param setFilterValues - Your state setter function
 */
export const handleFiltersChange = (
  filters: Record<string, any>,
  setFilterValues: (filters: Record<string, any>) => void
) => {
  setFilterValues(filters);
};

/**
 * Alternative: Create a function that returns a handleFiltersChange function
 * @param setFilterValues - Your state setter function
 * @returns handleFiltersChange function ready to use
 */
export const createFilterHandler = (
  setFilterValues: (filters: Record<string, any>) => void
) => {
  return (filters: Record<string, any>) => {
    setFilterValues(filters);
  };
};
