

/**
 * Generic delete handler that takes a delete function and modal state setter
 * @param deleteFunction - The API delete function (mutateAsync)
 * @param setModalState - Function to close the modal after deletion
 * @returns 
 */
export const createDeleteHandler = (
  deleteFunction: (id: string) => Promise<any>,
  setModalState: (state: any) => void
) => {
  return async (id: string) => {
    try {
      await deleteFunction(id);
      setModalState(null); 
    } catch {
    }
  };
};

/**
 * Simple delete handler - just pass the delete function and it returns a handler
 * @param deleteFunction - The API delete function (mutateAsync)
 * @returns A function that handles the delete operation
 */
export const handleDelete = (deleteFunction: (id: string) => Promise<any>) => {
  return async (id: string) => {
    try {
      await deleteFunction(id);
    } catch (error) {
      console.error('Delete operation failed:', error);
    }
  };
};

/**
 * Delete handler with custom callback
 * @param deleteFunction - The API delete function (mutateAsync)
 * @param onSuccess - Callback function to run after successful deletion
 * @returns A function that handles the delete operation
 */
export const createDeleteHandlerWithCallback = (
  deleteFunction: (id: string) => Promise<any>,
  onSuccess?: () => void
) => {
  return async (id: string) => {
    try {
      await deleteFunction(id);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Delete operation failed:', error);
    }
  };
};
