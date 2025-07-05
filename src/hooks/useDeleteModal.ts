import { useCallback } from "react";
import { useConfirmModal } from "../contexts/ModalContext";

interface DeleteModalOptions {
  title?: string;
  itemName: string;
  itemType?: string;
  onConfirm: () => void;
  customMessage?: string;
}

export const useDeleteModal = () => {
  const { openConfirmModal } = useConfirmModal();

  const openDeleteModal = useCallback(
    ({
      title,
      itemName,
      itemType = "item",
      onConfirm,
      customMessage,
    }: DeleteModalOptions) => {
      const modalTitle = title || `Delete ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`;
      const message = customMessage || 
        `Are you sure you want to delete ${itemType} "${itemName}"? This action cannot be undone.`;

      openConfirmModal({
        title: modalTitle,
        message,
        onConfirm,
      });
    },
    [openConfirmModal]
  );

  return { openDeleteModal };
};

// Convenience functions for common delete operations
export const useOrderDeleteModal = () => {
  const { openDeleteModal } = useDeleteModal();

  const deleteOrder = useCallback(
    (orderNumber: string, onConfirm: () => void) => {
      openDeleteModal({
        title: "Delete Order",
        itemName: orderNumber,
        itemType: "order",
        onConfirm,
      });
    },
    [openDeleteModal]
  );

  return { deleteOrder };
};

export const useUserDeleteModal = () => {
  const { openDeleteModal } = useDeleteModal();

  const deleteUser = useCallback(
    (userName: string, onConfirm: () => void) => {
      openDeleteModal({
        title: "Delete User",
        itemName: userName,
        itemType: "user",
        onConfirm,
      });
    },
    [openDeleteModal]
  );

  return { deleteUser };
};

export const useProductDeleteModal = () => {
  const { openDeleteModal } = useDeleteModal();

  const deleteProduct = useCallback(
    (productName: string, onConfirm: () => void) => {
      openDeleteModal({
        title: "Delete Product",
        itemName: productName,
        itemType: "product",
        onConfirm,
      });
    },
    [openDeleteModal]
  );

  return { deleteProduct };
};

export const useCategoryDeleteModal = () => {
  const { openDeleteModal } = useDeleteModal();

  const deleteCategory = useCallback(
    (categoryName: string, onConfirm: () => void) => {
      openDeleteModal({
        title: "Delete Category",
        itemName: categoryName,
        itemType: "category",
        onConfirm,
      });
    },
    [openDeleteModal]
  );

  return { deleteCategory };
};
