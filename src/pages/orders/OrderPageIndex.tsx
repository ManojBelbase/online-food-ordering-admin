import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Text } from "@mantine/core";
import { IconPlus, IconEye, IconEdit, IconTrash } from "@tabler/icons-react";
import DataTable from "../../components/GlobalComponents/DataTable";
import PageHeader from "../../components/GlobalComponents/PageHeader";
import StatusBadge from "../../components/GlobalComponents/StatusBadge";
import { useModal, useConfirmModal } from "../../contexts/ModalContext";
import type { TableColumn, TableAction, PaginationInfo } from "../../types/ui";

interface OrderDisplay {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  createdAt: string;
  deliveryAddress: string;
}

const OrderPageIndex: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { openConfirmModal } = useConfirmModal();
  const [orders, setOrders] = useState<OrderDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Mock data for demonstration
  const mockOrders: OrderDisplay[] = [
    {
      id: "1",
      orderNumber: "ORD-001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      itemsCount: 3,
      total: 45.99,
      status: "pending",
      createdAt: "2024-01-15T10:30:00Z",
      deliveryAddress: "123 Main St, City, State",
    },
    {
      id: "2",
      orderNumber: "ORD-002",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      itemsCount: 2,
      total: 32.5,
      status: "preparing",
      createdAt: "2024-01-15T11:15:00Z",
      deliveryAddress: "456 Oak Ave, City, State",
    },
    {
      id: "3",
      orderNumber: "ORD-003",
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
      itemsCount: 5,
      total: 78.25,
      status: "delivered",
      createdAt: "2024-01-15T09:45:00Z",
      deliveryAddress: "789 Pine Rd, City, State",
    },
  ];

  useEffect(() => {
    loadOrders();
  }, [pagination.page, pagination.limit]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setOrders(mockOrders);
        setPagination((prev) => ({
          ...prev,
          total: mockOrders.length,
          totalPages: Math.ceil(mockOrders.length / prev.limit),
        }));
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error("Error loading orders:", error);
      setLoading(false);
    }
  };

  const columns: TableColumn<OrderDisplay>[] = [
    {
      key: "orderNumber",
      label: "Order #",
      sortable: true,
      width: 120,
    },
    {
      key: "customerName",
      label: "Customer",
      sortable: true,
    },
    {
      key: "customerEmail",
      label: "Email",
      sortable: true,
    },
    {
      key: "items",
      label: "Items",
      align: "center",
      width: 80,
    },
    {
      key: "total",
      label: "Total",
      align: "right",
      width: 100,
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      width: 120,
      render: (value) => <StatusBadge status={value} type="order" />,
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      width: 120,
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  const actions: TableAction<OrderDisplay>[] = [
    {
      label: "View Details",
      icon: <IconEye size={16} />,
      onClick: (order) => {
        openModal({
          title: `Order ${order.orderNumber}`,
          size: "lg",
          body: (
            <div>
              <Text>
                <strong>Customer:</strong> {order.customerName}
              </Text>
              <Text>
                <strong>Email:</strong> {order.customerEmail}
              </Text>
              <Text>
                <strong>Items:</strong> {order.itemsCount}
              </Text>
              <Text>
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </Text>
              <Text>
                <strong>Status:</strong> {order.status}
              </Text>
              <Text>
                <strong>Address:</strong> {order.deliveryAddress}
              </Text>
              <Text>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </Text>
            </div>
          ),
        });
      },
    },
    {
      label: "Edit Order",
      icon: <IconEdit size={16} />,
      onClick: (order) => {
        navigate(`/orders/edit/${order.id}`);
      },
    },
    {
      label: "Delete Order",
      icon: <IconTrash size={16} />,
      color: "red",
      onClick: (order) => {
        openConfirmModal({
          title: "Delete Order",
          message: `Are you sure you want to delete order ${order.orderNumber}? This action cannot be undone.`,
          onConfirm: () => {
            console.log("Delete order:", order);
          },
        });
      },
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
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
        data={orders}
        columns={columns}
        actions={actions}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onLimitChange={(limit) =>
          setPagination((prev) => ({ ...prev, limit, page: 1 }))
        }
        onRefresh={loadOrders}
        loading={loading}
        title="All Orders"
        searchPlaceholder="Search orders..."
        // alternateRows={true}
      />
    </div>
  );
};

export default OrderPageIndex;
