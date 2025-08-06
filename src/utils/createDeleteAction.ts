import { createDeleteAction as originalCreateDeleteAction } from '../components/GlobalComponents/TableActions';

/**
 * Enhanced delete action creator with built-in confirmation
 * @param deleteFunction - The delete function to call
 * @param itemName - Name of the item to show in confirmation
 * @param itemId - ID of the item to delete
 * @returns Delete action with confirmation dialog
 */
export const onDelete = (
  deleteFunction: (id: string) => Promise<any>,
  itemName: string,
  itemId: string
) => {
  return originalCreateDeleteAction(() => {
    if (window.confirm(`Are you sure you want to delete "${itemName}"?`)) {
      deleteFunction(itemId);
    }
  });
};

/**
 * Simple delete action creator - just pass the function
 * @param onDelete - Function to call when delete is clicked
 * @returns Delete action
 */
export const createSimpleDeleteAction = (onDelete: () => void) => {
  return originalCreateDeleteAction(onDelete);
};
