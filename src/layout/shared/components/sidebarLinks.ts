import {
  IconDashboard,
  IconShoppingCart,
  IconUsers,
  IconReportAnalytics,
  IconSettings,
  IconCreditCard,
  IconTruck,
  IconBell,
  IconUserCog,
  IconChefHat,
  IconUser,
  IconPalette,
} from "@tabler/icons-react";
import { ROUTES } from "../../../constants/frontendRoutes";

export const sidebarLinks = [
  {
    label: "Dashboard",
    to: "/",
    icon: IconDashboard,
  },
  {
    label: "Orders",
    to: ROUTES.ORDERS,
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
  {
    label: "Delivery",
    to: "/delivery",
    icon: IconTruck,
    children: [
      { label: "Delivery Areas", to: "/delivery/areas" },
      { label: "Delivery Staff", to: "/delivery/staff" },
      { label: "Delivery Tracking", to: "/delivery/tracking" },
    ],
  },
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
  {
    label: "Notifications",
    to: "/notifications",
    icon: IconBell,
  },
  {
    label: "Settings",
    to: "/settings",
    icon: IconSettings,
    children: [
      { label: "General Settings", to: "/settings/general" },
      { label: "Restaurant Info", to: "/settings/restaurant" },
      { label: "Operating Hours", to: "/settings/hours" },
      { label: "Tax Settings", to: "/settings/tax" },
    ],
  },
  {
    label: "User Management",
    to: "/users",
    icon: IconUserCog,
    children: [
      { label: "Admin Users", to: "/users/admins" },
      { label: "Staff Management", to: "/users/staff" },
      { label: "Roles & Permissions", to: "/users/roles" },
    ],
  },
  {
    label: "Profile",
    to: ROUTES.PROFILE,
    icon: IconUser,
  },
  {
    label: "Theme Test",
    to: ROUTES.THEME_TEST,
    icon: IconPalette,
  },
];
