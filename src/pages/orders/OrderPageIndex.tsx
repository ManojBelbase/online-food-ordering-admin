import React, { useMemo, useCallback } from "react";
import PageHeader from "../../components/GlobalComponents/PageHeader";
import DataTable from "../../components/GlobalComponents/Table/DataTable";
// Removed useOrderDeleteModal - no API calls for now
import { DateFormatter } from "../../components/GlobalComponents/DateFormatter";
import StatusBadge from "../../components/GlobalComponents/StatusBadge";
import TableActions, { createViewAction, createEditAction, createDeleteAction } from "../../components/GlobalComponents/TableActions";
import ViewOrder from "./Compoents/ViewOrder";
import { useOrders } from "../../hooks/useOrders";
import type { OrderDisplay } from "../../config/orderTableConfig";


const OrderPageIndex: React.FC = () => {

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
    console.log("🔧 Applied filters:", filters);
    console.log("📊 Sample order data:", orders?.[0]);
  }, [orders]);


  const handleEditOrder = useCallback((order: OrderDisplay) => {
    console.log("Edit order:", order);
    // TODO: Implement edit functionality when API is ready
  }, []);

  const handleDeleteOrder = useCallback((order: OrderDisplay) => {
    console.log("Delete order:", order);
    // TODO: Implement delete functionality when API is ready
  }, []);

  const tableData = useMemo(() => {
    return {
      columns: [
        { title: "SN", key: "sn", sortable: false },
        { title: "Order #", key: "orderNumber", sortable: true },
        { title: "Customer", key: "customerName", sortable: true },
        { title: "Email", key: "customerEmail", sortable: true },
        { title: "Items", key: "itemsCount", sortable: true },
        { title: "Total", key: "total", sortable: true },
        { title: "Status", key: "statusDisplay", sortable: false }, // Use display field
        { title: "Date", key: "createdAtDisplay", sortable: false }, // Use display field
        { title: "Action", key: "action", sortable: false }
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
          // 🔧 Store raw status for filtering, rendered component for display
          status: order.status, // Raw status for filtering
          statusDisplay: (
            <StatusBadge status={order.status} type="order" />
          ),
          createdAt: order.createdAt, // Raw date for filtering
          createdAtDisplay: <DateFormatter date={order.createdAt}  />,
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
        subtitle="View and track all customer orders from this dashboard"
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
        showFilters={false} // Keep false to use toggle button
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
