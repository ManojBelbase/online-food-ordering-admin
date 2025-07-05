import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import PageHeader from "../../components/GlobalComponents/PageHeader";
import DataTable from "../../components/GlobalComponents/DataTable";
import { useOrderDeleteModal } from "../../hooks/useDeleteModal";
import { DateFormatter } from "../../components/GlobalComponents/DateFormatter";
import StatusBadge from "../../components/GlobalComponents/StatusBadge";
import TableActions, { createViewAction, createEditAction, createDeleteAction } from "../../components/GlobalComponents/TableActions";
import ViewOrder from "./Compoents/ViewOrder";
import { useOrders } from "../../hooks/useOrders";
import type { OrderDisplay } from "../../config/orderTableConfig";


const OrderPageIndex: React.FC = () => {
  const navigate = useNavigate();
  const { deleteOrder } = useOrderDeleteModal();

  const {
    orders,
    loading,
    selectedOrder,
    viewOrderOpened,
    pagination,
    loadOrders,
    setPagination,
    handleViewOrder,
    handleCloseViewOrder,
  } = useOrders();

  const orderFilters = useMemo(() => [
    {
      key: "status",
      label: "Status",
      type: "select" as const,
      options: [
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Preparing", value: "preparing" },
        { label: "Ready", value: "ready" },
        { label: "Out for Delivery", value: "out_for_delivery" },
        { label: "Delivered", value: "delivered" },
        { label: "Cancelled", value: "cancelled" },
      ],
      placeholder: "Filter by status",
    },
    {
      key: "customerName",
      label: "Customer Name",
      type: "text" as const,
      placeholder: "Search by customer name",
    },

  ], []);

  const handleFiltersChange = useCallback((filters: Record<string, any>) => {
    console.log("Applied filters:", filters);
    
  }, []);


  const handleEditOrder = useCallback((order: OrderDisplay) => {
    navigate(`/orders/edit/${order.id}`);
  }, [navigate]);

  const handleDeleteOrder = useCallback((order: OrderDisplay) => {
    deleteOrder(order.orderNumber, () => {
      console.log("Delete order:", order);
      // Add your actual delete logic here
      // For example: deleteOrderById(order.id);
    });
  }, [deleteOrder]);

  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "SN", key: "sn", },
        { title: "Order #", key: "orderNumber", },
        { title: "Customer", key: "customerName"},
        { title: "Email", key: "customerEmail"  },
        { title: "Items", key: "itemsCount"},
        { title: "Total", key: "total"},
        { title: "Status", key: "status" },
        { title: "Date", key: "createdAt" },
        { title: "Action", key: "action",} 
      ],
      rows:
        orders?.map((order: OrderDisplay, index: number) => ({
          id: order?.id,
          sn: index + 1,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          itemsCount: order.itemsCount,
          total: `$${order.total.toFixed(2)}`,
          status: (
            <StatusBadge status={order.status} type="order" />
          ),
          createdAt: <DateFormatter date={order.createdAt}  />,
          action: (
            <TableActions
              actions={[
                createViewAction(() => handleViewOrder(order)),
                createEditAction(() => handleEditOrder(order)),
                createDeleteAction(() => handleDeleteOrder(order)),
              ]}
            />
          ),
        })) || [],
    };
  }, [orders, handleViewOrder, handleEditOrder, handleDeleteOrder]);

  return (
    <div>
      <PageHeader
        title="Orders Management"
        subtitle="Manage and track all customer orders from this dashboard"
        actions={[
          {
            label: "New Order",
            onClick: () => navigate("/orders/create"),
            icon: <IconPlus size={16} />,
            variant: "filled",
          },
        ]}
      />

      <DataTable
        data={tableData.rows}
        columns={tableData.columns}
        pagination={pagination}
        onPageChange={(page: number) => setPagination((prev) => ({ ...prev, page }))}
        onLimitChange={(limit: number) =>
          setPagination((prev) => ({ ...prev, limit, page: 1 }))
        }
        onRefresh={loadOrders}
        loading={loading}
        title="All Orders"
        searchPlaceholder="Search orders..."
        alternateRows={true}
        align="center"
        filters={orderFilters}
        showFilters={false}
        onFiltersChange={handleFiltersChange}
      />

      <ViewOrder
        order={selectedOrder}
        opened={viewOrderOpened}
        onClose={handleCloseViewOrder}
      />
    </div>
  );
};

export default OrderPageIndex;
