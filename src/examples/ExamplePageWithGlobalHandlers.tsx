/**
 * EXAMPLE: How to use global handlers in any page
 * Copy this pattern to use in your pages
 */

import { useState } from 'react';
import { createDeleteHandler } from '../utils/globalDeleteHandler';
// Import your API (example)
// import { categoryApi } from '../server-action/api/category';

const ExamplePage = () => {
  // Your existing state
  const [modalState, setModalState] = useState<any>(null);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  
  // Your API hooks (example)
  // const { mutateAsync: deleteCategory } = categoryApi.useDelete();
  
  // ============================================================================
  // GLOBAL FILTER HANDLER - Copy this to any page
  // ============================================================================
  const handleFiltersChange = (filters: Record<string, any>) => {
    setFilterValues(filters);
  };

  // ============================================================================
  // GLOBAL DELETE HANDLER - Copy this to any page
  // ============================================================================
  // const handleDeleteCategory = createDeleteHandler(deleteCategory, setModalState);
  
  // Alternative: If you want custom callback after delete
  // const handleDeleteCategory = createDeleteHandlerWithCallback(
  //   deleteCategory, 
  //   () => {
  //     setModalState(null);
  //     // Add any other logic like refetch, notifications, etc.
  //   }
  // );

  return (
    <div>
      {/* Your DataTable */}
      {/* 
      <DataTable
        // ... other props
        filters={yourFilters}
        onFiltersChange={handleFiltersChange}  // Use global filter handler
      />
      */}
      
      {/* Your Delete Modal */}
      {/* 
      <DeleteModal
        opened={modalState?.mode === 'delete'}
        itemName={modalState?.data?.name || ''}
        onClose={() => setModalState(null)}
        onConfirm={() => modalState?.data?._id && handleDeleteCategory(modalState.data._id)}  // Use global delete handler
      />
      */}
    </div>
  );
};

export default ExamplePage;

/**
 * USAGE SUMMARY:
 * 
 * 1. FILTER HANDLER:
 *    const handleFiltersChange = (filters: Record<string, any>) => {
 *      setFilterValues(filters);
 *    };
 * 
 * 2. DELETE HANDLER:
 *    import { createDeleteHandler } from '../utils/globalDeleteHandler';
 *    const handleDelete = createDeleteHandler(yourDeleteFunction, setModalState);
 * 
 * 3. USE IN JSX:
 *    onFiltersChange={handleFiltersChange}
 *    onConfirm={() => id && handleDelete(id)}
 */
