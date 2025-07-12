import {
  IconDashboard,
  IconShoppingCart,
  IconUsers,
  IconReportAnalytics,
  IconCreditCard,
  IconTruck,
  IconChefHat,
  IconUser,
  IconLock,
} from "@tabler/icons-react";
import { FRONTENDROUTES } from "../constants/frontendRoutes";

interface ISidebarLinks {
  label: string;
  to: string;
  icon?: React.ComponentType<any>;
  children?: ISidebarLinks[];
}

export const sidebarLinks: ISidebarLinks[] = [
  { label: "Dashboard", to: "/", icon: IconDashboard },
  {
    label: "Orders",
    to: FRONTENDROUTES.ORDERS,
    icon: IconShoppingCart,
    children: [
      { label: "All Orders", to: "/orders" },
      { label: "Create Order", to: "/orders/create" },
      { label: "Pending Orders", to: "/orders/pending" },
      { label: "Processing", to: "/orders/processing" },
      { label: "Completed", to: "/orders/completed" },
      { label: "Cancelled", to: "/orders/cancelled" },
    ],
  },
  {
    label: "Menu Management",
    to: "/menu",
    icon: IconChefHat,
    children: [
      { label: "Categories", to: "/menu/categories" },
      { label: "Food Items", to: "/menu/items" },
      { label: "Add New Item", to: "/menu/add-item" },
      { label: "Inventory", to: "/menu/inventory" },
    ],
  },
  {
    label: "Customers",
    to: "/customers",
    icon: IconUsers,
    children: [
      { label: "All Customers", to: "/customers" },
      { label: "Customer Reviews", to: "/customers/reviews" },
      { label: "Loyalty Program", to: "/customers/loyalty" },
    ],
  },
  { label: "Category", to: FRONTENDROUTES.CATEGORY, icon: IconTruck },
  {
    label: "Payments",
    to: "/payments",
    icon: IconCreditCard,
    children: [
      { label: "Transactions", to: "/payments/transactions" },
      { label: "Payment Methods", to: "/payments/methods" },
      { label: "Refunds", to: "/payments/refunds" },
    ],
  },
  {
    label: "Analytics",
    to: "/analytics",
    icon: IconReportAnalytics,
    children: [
      { label: "Sales Report", to: "/analytics/sales" },
      { label: "Customer Analytics", to: "/analytics/customers" },
      { label: "Menu Performance", to: "/analytics/menu" },
      { label: "Revenue Trends", to: "/analytics/revenue" },
    ],
  },


  { label: "Permission", to: FRONTENDROUTES.PERMISSION, icon: IconLock },
  { label: "Profile", to: FRONTENDROUTES.PROFILE, icon: IconUser },
];