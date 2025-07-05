import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingOverlay } from "@mantine/core";
import PageHeader from "../../components/GlobalComponents/PageHeader";
import OrderForm from "../../components/Forms/OrderForm";
import type { OrderFormData } from "../../types/ui";

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<
    Partial<OrderFormData> | undefined
  >();

  const isEditMode = !!id;

  // Load existing order data when in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      loadOrderData(id);
    }
  }, [isEditMode, id]);

  const loadOrderData = async (orderId: string) => {
    setLoading(true);
    try {
      // Simulate API call to load order data for the given orderId
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Use orderId to avoid unused variable warning (for demonstration)
      // In real API call, orderId would be used to fetch the order
      console.log("Loading order data for orderId:", orderId);

      // Mock data for demonstration - replace with actual API call
      const mockOrderData: Partial<OrderFormData> = {
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "+1-555-0123",
        deliveryAddress: {
          street: "123 Main St",
          city: "Springfield",
          state: "IL",
          zipCode: "62701",
          country: "USA",
        },
        paymentMethod: "credit_card",
        specialInstructions: "Ring doorbell twice",
      };

      setInitialData(mockOrderData);
    } catch (error) {
      console.error("Error loading order data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderSubmit = async (data: OrderFormData) => {
    try {
      if (isEditMode) {
        console.log("Updating order:", id, data);
      } else {
        console.log("Creating order:", data);
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate back to orders list
      navigate("/orders");
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} order:`,
        error
      );
      throw error; // Let the form handle the error display
    }
  };

  if (loading) {
    return (
      <div
        style={{ padding: "20px", position: "relative", minHeight: "400px" }}
      >
        <LoadingOverlay visible={true} />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <PageHeader
        title={isEditMode ? "Edit Order" : "Create New Order"}
        subtitle={
          isEditMode
            ? `Edit order details for Order #${id}`
            : "Fill out the form below to create a new customer order"
        }
        showBackButton={true}
        onBack={() => navigate("/orders")}
      />

      <OrderForm
        onSubmit={handleOrderSubmit}
        initialData={initialData}
        title={isEditMode ? "Edit Order Information" : "Order Information"}
        submitLabel={isEditMode ? "Update Order" : "Create Order"}
      />
    </div>
  );
};

export default CreateOrderPage;
