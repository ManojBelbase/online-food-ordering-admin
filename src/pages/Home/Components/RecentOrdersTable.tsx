import React from "react";
import { Card, Title, Table, Badge } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";
import { CustomText } from "../../../components/ui";

interface RecentOrder {
  orderId: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod: string;
  itemCount: number;
  createdAt: string;
}

interface RecentOrdersTableProps {
  data: RecentOrder[];
}

const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ data }) => {
  const { theme } = useTheme();

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: theme.colors.warning,
      accepted: theme.colors.primary,
      preparing: theme.colors.primary,
      ready: theme.colors.success,
      completed: theme.colors.success,
      cancelled: theme.colors.error,
    };
    return statusColors[status.toLowerCase()] || theme.colors.textSecondary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const rows = data.map((order) => (
    <Table.Tr key={order.orderId}>
      <Table.Td>
        <CustomText size="sm" fontWeight={600} color="primary">
          {order.orderId.slice(-8)}
        </CustomText>
      </Table.Td>
      <Table.Td>
        <div>
          <CustomText size="sm" color="primary">
            {order.customerName}
          </CustomText>
          <CustomText size="xs" color="secondary">
            {order.customerEmail}
          </CustomText>
        </div>
      </Table.Td>
      <Table.Td>
        <CustomText size="sm" color="primary">
          ${order.totalAmount.toFixed(2)}
        </CustomText>
      </Table.Td>
      <Table.Td>
        <Badge
          color={getStatusColor(order.orderStatus)}
          variant="light"
          size="sm"
        >
          {order.orderStatus}
        </Badge>
      </Table.Td>
      <Table.Td>
        <CustomText size="sm" color="secondary">
          {order.paymentMethod}
        </CustomText>
      </Table.Td>
      <Table.Td>
        <CustomText size="sm" color="secondary">
          {order.itemCount} items
        </CustomText>
      </Table.Td>
      <Table.Td>
        <CustomText size="xs" color="secondary">
          {formatDate(order.createdAt)}
        </CustomText>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="sm"
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        height: "100%",
      }}
    >
      <Title order={3} mb="md" style={{ color: theme.colors.textPrimary }}>
        📋 Recent Orders
      </Title>
      {data.length === 0 ? (
        <CustomText color="secondary" size="sm">
          No recent orders
        </CustomText>
      ) : (
        <Table.ScrollContainer minWidth={800}>
          <Table verticalSpacing="sm" highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <CustomText size="sm" fontWeight={600} color="secondary">
                    Order ID
                  </CustomText>
                </Table.Th>
                <Table.Th>
                  <CustomText size="sm" fontWeight={600} color="secondary">
                    Customer
                  </CustomText>
                </Table.Th>
                <Table.Th>
                  <CustomText size="sm" fontWeight={600} color="secondary">
                    Amount
                  </CustomText>
                </Table.Th>
                <Table.Th>
                  <CustomText size="sm" fontWeight={600} color="secondary">
                    Status
                  </CustomText>
                </Table.Th>
                <Table.Th>
                  <CustomText size="sm" fontWeight={600} color="secondary">
                    Payment
                  </CustomText>
                </Table.Th>
                <Table.Th>
                  <CustomText size="sm" fontWeight={600} color="secondary">
                    Items
                  </CustomText>
                </Table.Th>
                <Table.Th>
                  <CustomText size="sm" fontWeight={600} color="secondary">
                    Date
                  </CustomText>
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      )}
    </Card>
  );
};

export default RecentOrdersTable;

