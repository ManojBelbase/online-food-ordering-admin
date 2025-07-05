// Order Display Interface for Table
export interface OrderDisplay {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  itemsCount: number;
  total: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  createdAt: string;
  deliveryAddress?: string;
}

// Mock Orders Data
export const mockOrders: OrderDisplay[] = [
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
  {
    id: "4",
    orderNumber: "ORD-004",
    customerName: "Alice Brown",
    customerEmail: "alice@example.com",
    customerPhone: "+1-555-0321",
    itemsCount: 1,
    total: 15.75,
    status: "confirmed",
    createdAt: "2024-01-15T12:00:00Z",
    deliveryAddress: "321 Elm St, City, State",
  },
  {
    id: "5",
    orderNumber: "ORD-005",
    customerName: "Charlie Wilson",
    customerEmail: "charlie@example.com",
    customerPhone: "+1-555-0654",
    itemsCount: 4,
    total: 62.40,
    status: "ready",
    createdAt: "2024-01-15T13:30:00Z",
    deliveryAddress: "654 Maple Ave, City, State",
  },
  {
    id: "6",
    orderNumber: "ORD-006",
    customerName: "Diana Green",
    customerEmail: "diana@example.com",
    customerPhone: "+1-555-0987",
    itemsCount: 2,
    total: 28.90,
    status: "out_for_delivery",
    createdAt: "2024-01-15T14:15:00Z",
    deliveryAddress: "987 Cedar Ln, City, State",
  },
  {
    id: "7",
    orderNumber: "ORD-007",
    customerName: "Edward Davis",
    customerEmail: "edward@example.com",
    customerPhone: "+1-555-0147",
    itemsCount: 6,
    total: 95.30,
    status: "cancelled",
    createdAt: "2024-01-15T15:45:00Z",
    deliveryAddress: "147 Birch St, City, State",
  },
  {
    id: "8",
    orderNumber: "ORD-008",
    customerName: "Fiona Miller",
    customerEmail: "fiona@example.com",
    customerPhone: "+1-555-0258",
    itemsCount: 3,
    total: 41.85,
    status: "preparing",
    createdAt: "2024-01-15T16:20:00Z",
    deliveryAddress: "258 Spruce Dr, City, State",
  },
  {
    id: "9",
    orderNumber: "ORD-009",
    customerName: "George Taylor",
    customerEmail: "george@example.com",
    customerPhone: "+1-555-0369",
    itemsCount: 1,
    total: 12.50,
    status: "delivered",
    createdAt: "2024-01-15T17:00:00Z",
    deliveryAddress: "369 Willow Way, City, State",
  },
  {
    id: "10",
    orderNumber: "ORD-010",
    customerName: "Hannah White",
    customerEmail: "hannah@example.com",
    customerPhone: "+1-555-0741",
    itemsCount: 7,
    total: 112.75,
    status: "pending",
    createdAt: "2024-01-15T18:30:00Z",
    deliveryAddress: "741 Poplar Pl, City, State",
  },
];
