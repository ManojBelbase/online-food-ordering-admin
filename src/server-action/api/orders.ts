import { createApiConfig } from "../../config/APIConfig";

export interface IOrderItem {
  foodItemId: string;
  name: string;
  quantity: number;
  priceAtTime: number;
  image: string;
  isVeg: boolean;
  notes?: string;
}
export interface IOrder{
  _id?: string;
  userId?: string;
  restaurantId: string;
  items: IOrderItem[];
  totalAmount: number;
  orderStatus:
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "cancelled"
    | "completed";
  paymentMethod: "COD" | "Khalti";
  paymentStatus: "pending" | "completed" | "failed";
  paymentTransactionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
  export const orderApi = createApiConfig<IOrder>("order/restaurant", "Order")


export const updateOrderStatus = async (orderId: string, orderStatus: string) => {
  const baseUrl = import.meta.env.VITE_REACT_APP_API_URL || '';
  const url = baseUrl.endsWith('/') 
    ? `${baseUrl}order/${orderId}?orderStatus=${orderStatus}`
    : `${baseUrl}/order/${orderId}?orderStatus=${orderStatus}`;
  
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to update order status');
  }

  return response.json();
};