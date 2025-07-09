import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { ROUTES } from "../constants/frontendRoutes.ts";
import ProtectedRoute from "../auth/ProtectedRoute.tsx";
import withSuspense, { withPageLoader, withSkeleton } from "../utils/withSuspense";

// 🚀 Lazy load components with withSuspense HOC for better loading UX
const Layout = withSuspense(lazy(() => import("../layout/Layout")), {
  message: "Loading application layout...",
  type: "spinner"
});

const HomePage = withPageLoader(
  lazy(() => import("../pages/Home/HomePage")),
  "Loading home page..."
);

const ComponentsIndex = withPageLoader(
  lazy(() => import("../pages/dashboard/ComponentsIndex")),
  "Loading dashboard..."
);

const OrderPageIndex = withSkeleton(
  lazy(() => import("../pages/orders/OrderPageIndex"))
);

// CreateOrderPage removed - keeping only table display

const LoginPage = withPageLoader(
  lazy(() => import("../auth/LoginPage")),
  "Loading login..."
);

const AddMenuItemPage = withPageLoader(
  lazy(() => import("../pages/Menu/AddMenuItemPage")),
  "Loading menu form..."
);

const ProfilePage = withPageLoader(
  lazy(() => import("../pages/ProfilePage")),
  "Loading profile..."
);

const NotificationsPage = withPageLoader(
  lazy(() => import("../pages/NotificationsPage")),
  "Loading notifications..."
);

const ThemeTestPage = withPageLoader(
  lazy(() => import("../pages/ThemeTestPage")),
  "Loading theme test..."
);

const NotFoundPage = withSuspense(lazy(() => import("../pages/NotFoundPage")), {
  message: "Page not found...",
  type: "custom"
});

// ✅ All components now use withSuspense HOC for consistent loading UX

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

// 404 Not Found Route (must be last)
const notFoundRoute: RouteObject = {
  path: "*",
  element: <NotFoundPage />,
};

const routes: RouteObject[] = [...publicRoutes, ...protectedRoutes, notFoundRoute];

export { routes };
