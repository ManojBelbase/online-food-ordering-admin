// Global UI Types for the Food Ordering Admin System

import { ReactNode } from "react";

// ============================================================================
// TABLE COMPONENT TYPES
// ============================================================================

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T, index: number) => ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface TableAction<T = any> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T, index: number) => void;
  color?: string;
  disabled?: (row: T) => boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  onSort?: (column: string, direction: "asc" | "desc") => void;
  onFilter?: (filters: Record<string, string>) => void;
  onRefresh?: () => void;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  title?: string;
  emptyMessage?: string;
  pageSize?: number;
  alternateRows?: boolean;
}

// ============================================================================
// FORM COMPONENT TYPES
// ============================================================================

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "multiselect"
    | "checkbox"
    | "switch"
    | "date"
    | "time"
    | "file";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[];
  accept?: string; // for file input
  multiple?: boolean; // for file input
  rows?: number; // for textarea
  min?: number; // for number input
  max?: number; // for number input
  step?: number; // for number input
  description?: string;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  width?: string | number;
  span?: number; // for grid layout
}

export interface FormSection {
  title?: string;
  description?: string;
  fields: FormField[];
  columns?: number;
}

export interface FormBuilderProps {
  form: any; // Mantine form type
  sections: FormSection[];
  onSubmit: (values: any) => void;
  loading?: boolean;
  submitLabel?: string;
  showReset?: boolean;
  resetLabel?: string;
  title?: string;
  description?: string;
}

// ============================================================================
// HEADER COMPONENT TYPES
// ============================================================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface ActionButton {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: "filled" | "outline" | "subtle";
  color?: string;
}

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ActionButton[] | ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

// ============================================================================
// BUSINESS DOMAIN TYPES
// ============================================================================

// Order Types
export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  itemsCount: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
  deliveryAddress: DeliveryAddress;
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string;
  notes?: string;
  specialInstructions?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: string[];
  notes?: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type PaymentMethod =
  | "credit_card"
  | "debit_card"
  | "paypal"
  | "cash_on_delivery"
  | "bank_transfer";

// Order Form Types
export interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: DeliveryAddress;
  items: OrderFormItem[];
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
  scheduledDeliveryTime?: string;
}

export interface OrderFormItem {
  menuItemId: string;
  quantity: number;
  customizations?: string[];
  notes?: string;
}
