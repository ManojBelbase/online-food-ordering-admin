import { useState, useEffect, useCallback } from "react";
import { mockOrders, type OrderDisplay } from "../config/orderTableConfig.tsx";
import type { PaginationInfo } from "../types/ui";

interface OrdersState {
  orders: OrderDisplay[];
  loading: boolean;
  selectedOrder: OrderDisplay | null;
  viewOrderOpened: boolean;
  pagination: PaginationInfo;
}

interface UseOrdersReturn extends OrdersState {
  loadOrders: () => void;
  setSelectedOrder: (order: OrderDisplay | null) => void;
  setViewOrderOpened: (opened: boolean) => void;
  setPagination: React.Dispatch<React.SetStateAction<PaginationInfo>>;
  handleViewOrder: (order: OrderDisplay) => void;
  handleCloseViewOrder: () => void;
}

export const useOrders = (): UseOrdersReturn => {
  const [state, setState] = useState<OrdersState>({
    orders: [],
    loading: false,
    selectedOrder: null,
    viewOrderOpened: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  });

  const loadOrders = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          orders: mockOrders,
          loading: false,
          pagination: {
            ...prev.pagination,
            total: mockOrders.length,
            totalPages: Math.ceil(mockOrders.length / prev.pagination.limit),
          },
        }));
      }, 1000);
    } catch (error: any) {
      console.error("Error loading orders:", error);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const setSelectedOrder = useCallback((order: OrderDisplay | null) => {
    setState(prev => ({ ...prev, selectedOrder: order }));
  }, []);

  const setViewOrderOpened = useCallback((opened: boolean) => {
    setState(prev => ({ ...prev, viewOrderOpened: opened }));
  }, []);

  const setPagination = useCallback((updater: React.SetStateAction<PaginationInfo>) => {
    setState(prev => ({
      ...prev,
      pagination: typeof updater === 'function' ? updater(prev.pagination) : updater,
    }));
  }, []);

  const handleViewOrder = useCallback((order: OrderDisplay) => {
    setState(prev => ({
      ...prev,
      selectedOrder: order,
      viewOrderOpened: true,
    }));
  }, []);

  const handleCloseViewOrder = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedOrder: null,
      viewOrderOpened: false,
    }));
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return {
    ...state,
    loadOrders,
    setSelectedOrder,
    setViewOrderOpened,
    setPagination,
    handleViewOrder,
    handleCloseViewOrder,
  };
};
