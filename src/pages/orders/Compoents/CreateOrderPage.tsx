import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingOverlay } from "@mantine/core";
import PageHeader from "../../../components/GlobalComponents/PageHeader";
import OrderForm from "./OrderForm";
import type { OrderFormData } from "../../../types/ui";

const CreateOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<
    Partial<OrderFormData> | undefined
  >();

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode && id) {
      loadOrderData(id);
    }
  }, [isEditMode, id]);

  const loadOrderData = async (orderId: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Loading order data for orderId:", orderId);

      // Mock orders data - should match the data from OrderPageIndex
      const mockOrders = [
        {
          id: "1",
          orderNumber: "ORD-001",
          customerName: "John Doe",
          customerEmail: "john@example.com",
          customerPhone: "+1-555-0123",
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
          customerPhone: "+1-555-0456",
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
          customerPhone: "+1-555-0789",
          itemsCount: 5,
          total: 78.25,
          status: "delivered",
          createdAt: "2024-01-15T09:45:00Z",
          deliveryAddress: "789 Pine Rd, City, State",
        },
      ];

      // Find the order by ID
      const foundOrder = mockOrders.find(order => order.id === orderId);

      if (foundOrder) {
        // Parse the delivery address string into components
        const addressParts = foundOrder.deliveryAddress.split(", ");

        const mockOrderData: Partial<OrderFormData> = {
          customerName: foundOrder.customerName,
          customerEmail: foundOrder.customerEmail,
          customerPhone: foundOrder.customerPhone,
          deliveryAddress: {
            street: addressParts[0] || "",
            city: addressParts[1] || "",
            state: addressParts[2] || "",
            zipCode: "12345", 
            country: "USA",
          },
          paymentMethod: "credit_card",
          specialInstructions: `Order ${foundOrder.orderNumber} - ${foundOrder.itemsCount} items`,
          items: [], // Would be populated from actual order items
        };

        setInitialData(mockOrderData);
      } else {
        console.error("Order not found with ID:", orderId);
        // Set empty data if order not found
        setInitialData({});
      }
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
