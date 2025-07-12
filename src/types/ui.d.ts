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

// Order Display Types (for table only - no API operations)
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

// ============================================================================