import { Badge } from "@mantine/core";
import type { OrderStatus, PaymentStatus } from "../../types/ui";

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | string;
  type?: "order" | "payment" | "general";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "general",
}) => {
  const getStatusConfig = (status: string, type: string) => {
    if (type === "order") {
      switch (status as OrderStatus) {
        case "pending":
          return { color: "yellow", label: "Pending" };
        case "confirmed":
          return { color: "blue", label: "Confirmed" };
        case "preparing":
          return { color: "orange", label: "Preparing" };
        case "ready":
          return { color: "cyan", label: "Ready" };
        case "out_for_delivery":
          return { color: "grape", label: "Out for Delivery" };
        case "delivered":
          return { color: "green", label: "Delivered" };
        case "cancelled":
          return { color: "red", label: "Cancelled" };
        default:
          return { color: "gray", label: status };
      }
    }

    if (type === "payment") {
      switch (status as PaymentStatus) {
        case "pending":
          return { color: "yellow", label: "Pending" };
        case "paid":
          return { color: "green", label: "Paid" };
        case "failed":
          return { color: "red", label: "Failed" };
        case "refunded":
          return { color: "orange", label: "Refunded" };
        case "partially_refunded":
          return { color: "yellow", label: "Partially Refunded" };
        default:
          return { color: "gray", label: status };
      }
    }

    // General status
    switch (status.toLowerCase()) {
      case "active":
        return { color: "green", label: status };
      case "inactive":
        return { color: "red", label: status };
      case "in use":
        return { color: "orange", label: status };
      case "available":
        return { color: "green", label: status };
      case "from global":
        return { color: "blue", label: status };
      case "custom":
        return { color: "teal", label: status };
      default:
        return { color: "gray", label: status };
    }
  };

  const config = getStatusConfig(status, type);

  return (
    <Badge color={config.color} variant="light" size="sm">
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
