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