import React from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { getOrderFormSections } from "../../utils/formConfigs";
import type { OrderFormData } from "../../types/ui";
import GlobalForm from "../GlobalComponents/GlobalForm";

interface OrderFormProps {
  onSubmit?: (data: OrderFormData) => void;
  initialData?: Partial<OrderFormData>;
  loading?: boolean;
  title?: string;
  submitLabel?: string;
}

const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  initialData,
  loading = false,
  title = "Create New Order",
  submitLabel = "Create Order",
}) => {
  const form = useForm<OrderFormData>({
    initialValues: {
      customerName: initialData?.customerName || "",
      customerEmail: initialData?.customerEmail || "",
      customerPhone: initialData?.customerPhone || "",
      deliveryAddress: {
        street: initialData?.deliveryAddress?.street || "",
        city: initialData?.deliveryAddress?.city || "",
        state: initialData?.deliveryAddress?.state || "",
        zipCode: initialData?.deliveryAddress?.zipCode || "",
        country: initialData?.deliveryAddress?.country || "USA",
      },
      items: initialData?.items || [],
      paymentMethod: initialData?.paymentMethod || "credit_card",
      specialInstructions: initialData?.specialInstructions || "",
      scheduledDeliveryTime: initialData?.scheduledDeliveryTime || "",
    },
    validate: {
      customerName: (value) => {
        if (!value) return "Customer name is required";
        if (value.length < 2)
          return "Customer name must be at least 2 characters";
        return null;
      },
      customerEmail: (value) => {
        if (!value) return "Email is required";
        if (!/^\S+@\S+$/.test(value)) return "Invalid email format";
        return null;
      },
      customerPhone: (value) => {
        if (!value) return "Phone number is required";
        if (!/^\+?[\d\s\-\(\)]+$/.test(value))
          return "Invalid phone number format";
        return null;
      },
    },
  });

  const handleSubmit = async (values: OrderFormData) => {
    try {
      console.log("Order form submitted:", values);

      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        notifications.show({
          title: "Success",
          message: "Order created successfully!",
          color: "green",
        });

        form.reset();
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create order. Please try again.",
        color: "red",
      });
    }
  };

  const formSections = getOrderFormSections();

  return (
    <GlobalForm
      form={form}
      sections={formSections}
      onSubmit={handleSubmit}
      loading={loading}
      title={title}
      description="Fill out the form below to create a new order"
      submitLabel={submitLabel}
      showReset={true}
      resetLabel="Clear Form"
    />
  );
};

export default OrderForm;
