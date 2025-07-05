import React, { useEffect } from "react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { getOrderFormSections } from "../../../utils/formConfigs";
import type { OrderFormData } from "../../../types/ui";
import GlobalForm from "../../../components/GlobalComponents/GlobalForm";
import { orderFormValidators } from "../../../validation/orderValidation";

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
  const getInitialValues = (data?: Partial<OrderFormData>): OrderFormData => ({
    customerName: data?.customerName || "",
    customerEmail: data?.customerEmail || "",
    customerPhone: data?.customerPhone || "",
    deliveryAddress: {
      street: data?.deliveryAddress?.street || "",
      city: data?.deliveryAddress?.city || "",
      state: data?.deliveryAddress?.state || "",
      zipCode: data?.deliveryAddress?.zipCode || "",
      country: data?.deliveryAddress?.country || "USA",
    },
    items: data?.items || [],
    paymentMethod: data?.paymentMethod || "credit_card",
    specialInstructions: data?.specialInstructions || "",
    scheduledDeliveryTime: data?.scheduledDeliveryTime || "",
  });

  const form = useForm<OrderFormData>({
    initialValues: getInitialValues(initialData),
    validate: orderFormValidators,
  });

  // Update form values when initialData changes
  useEffect(() => {
    if (initialData) {
      const newValues = getInitialValues(initialData);
      form.setValues(newValues);
    }
  }, [initialData]);

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
