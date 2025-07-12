import React from "react";
import { Modal, Text, Group, Badge, Stack, Divider } from "@mantine/core";
import { DateFormatter } from "../../../components/GlobalComponents/DateFormatter";
import StatusBadge from "../../../components/GlobalComponents/StatusBadge";
import type { OrderDisplay } from "../../../config/orderTableConfig";

interface ViewOrderProps {
  order: OrderDisplay | null;
  opened: boolean;
  onClose: () => void;
}

const ViewOrder: React.FC<ViewOrderProps> = ({ order, opened, onClose }) => {
  if (!order) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Order Details - ${order.orderNumber}`}
      size="lg"
      centered
    >
      <Stack gap="md">
        {/* Customer Information */}
        <div>
          <Text size="sm" fw={600} mb="xs" c="dimmed">
            CUSTOMER INFORMATION
          </Text>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Customer Name:</Text>
            <Text>{order.customerName}</Text>
          </Group>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Email:</Text>
            <Text>{order.customerEmail}</Text>
          </Group>
          <Group justify="space-between">
            <Text fw={500}>Delivery Address:</Text>
            <Text ta="right" style={{ maxWidth: "60%" }}>
              {order.deliveryAddress}
            </Text>
          </Group>
        </div>

        <Divider />

        {/* Order Information */}
        <div>
          <Text size="sm" fw={600} mb="xs" c="dimmed">
            ORDER INFORMATION
          </Text>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Order Number:</Text>
            <Badge variant="light" color="blue">
              {order.orderNumber}
            </Badge>
          </Group>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Items Count:</Text>
            <Badge variant="outline">
              {order.itemsCount} items
            </Badge>
          </Group>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Total Amount:</Text>
            <Text fw={600} size="lg" c="green">
              ${order.total.toFixed(2)}
            </Text>
          </Group>
          <Group justify="space-between" mb="xs">
            <Text fw={500}>Status:</Text>
            <StatusBadge status={order.status} type="order" />
          </Group>
          <Group justify="space-between">
            <Text fw={500}>Order Date:</Text>
            <Text>
              <DateFormatter date={order.createdAt} format="datetime" />
            </Text>
          </Group>
        </div>

        <Divider />

        {/* Additional Information */}
        <div>
          <Text size="sm" fw={600} mb="xs" c="dimmed">
            ADDITIONAL DETAILS
          </Text>
          <Text size="sm" c="dimmed">
            Order ID: {order.id}
          </Text>
        </div>
      </Stack>
    </Modal>
  );
};

export default ViewOrder;
