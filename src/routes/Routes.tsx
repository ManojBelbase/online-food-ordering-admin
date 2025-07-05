import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { ROUTES } from "../constants/frontendRoutes.ts";
import ProtectedRoute from "../auth/ProtectedRoute.tsx";

const Layout = lazy(() => import("../layout/Layout"));
const HomePage = lazy(() => import("../pages/Home/HomePage"));
const ComponentsIndex = lazy(
  () => import("../pages/dashboard/ComponentsIndex")
);
const OrderPageIndex = lazy(() => import("../pages/orders/OrderPageIndex"));
const CreateOrderPage = lazy(() => import("../pages/orders/Compoents/CreateOrderPage.tsx"));
const LoginPage = lazy(() => import("../auth/LoginPage"));
const AddMenuItemPage = lazy(() => import("../pages/Menu/AddMenuItemPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const NotificationsPage = lazy(() => import("../pages/NotificationsPage"));
const ThemeTestPage = lazy(() => import("../pages/ThemeTestPage"));

const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: ROUTES.HOME,
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "components", element: <ComponentsIndex /> },
      { path: ROUTES.ORDERS, element: <OrderPageIndex /> },
      { path: "orders/create", element: <CreateOrderPage /> },
      { path: "orders/edit/:id", element: <CreateOrderPage /> },
      { path: "orders/pending", element: <div>Pending Orders</div> },
      { path: "orders/processing", element: <div>Processing Orders</div> },
      { path: "orders/completed", element: <div>Completed Orders</div> },
      { path: "orders/cancelled", element: <div>Cancelled Orders</div> },

      // Profile
      { path: ROUTES.PROFILE.substring(1), element: <ProfilePage /> },

      // Menu Management
      { path: "menu/categories", element: <div>Menu Categories</div> },
      { path: "menu/items", element: <div>Menu Items</div> },
      { path: "menu/add-item", element: <AddMenuItemPage /> },
      { path: "menu/inventory", element: <div>Inventory</div> },

      // Customers
      { path: "customers", element: <div>All Customers</div> },
      { path: "customers/reviews", element: <div>Customer Reviews</div> },
      { path: "customers/loyalty", element: <div>Loyalty Program</div> },

      // Delivery
      { path: "delivery/areas", element: <div>Delivery Areas</div> },
      { path: "delivery/staff", element: <div>Delivery Staff</div> },
      { path: "delivery/tracking", element: <div>Delivery Tracking</div> },

      // Payments
      { path: "payments/transactions", element: <div>Transactions</div> },
      { path: "payments/methods", element: <div>Payment Methods</div> },
      { path: "payments/refunds", element: <div>Refunds</div> },

      // Analytics
      { path: "analytics/sales", element: <div>Sales Report</div> },
      { path: "analytics/customers", element: <div>Customer Analytics</div> },
      { path: "analytics/menu", element: <div>Menu Performance</div> },
      { path: "analytics/revenue", element: <div>Revenue Trends</div> },

      // Notifications
      { path: "notifications", element: <NotificationsPage /> },

      // Theme Test
      { path: "theme-test", element: <ThemeTestPage /> },

      // Settings
      { path: "settings/general", element: <div>General Settings</div> },
      { path: "settings/restaurant", element: <div>Restaurant Info</div> },
      { path: "settings/hours", element: <div>Operating Hours</div> },
      { path: "settings/tax", element: <div>Tax Settings</div> },

      { path: "users/admins", element: <div>Admin Users</div> },
      { path: "users/staff", element: <div>Staff Management</div> },
      { path: "users/roles", element: <div>Roles & Permissions</div> },
    ],
  },
];

// Combine all routes
const routes: RouteObject[] = [...publicRoutes, ...protectedRoutes];

export { routes };
