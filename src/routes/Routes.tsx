// routes.tsx
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute.tsx";
import withSuspense, { withPageLoader, withSkeleton } from "../utils/withSuspense";
import { FRONTENDROUTES } from "../constants/frontendRoutes.ts";
import CategoryPageIndex from "../pages/Category/CategoryPageIndex.tsx";
import CustomerPageIndex from "../pages/Custumer/CustomerPageIndex.tsx";
import UnauthorizedPage from "../components/GlobalComponents/UnAuthorizedPage.tsx";

const Layout = withSuspense(lazy(() => import("../layout/Layout")), {
  message: "Loading application layout...",
  type: "spinner",
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


const NotFoundPage = withSuspense(lazy(() => import("../pages/NotFoundPage")), {
  message: "Page not found...",
  type: "custom",
});

const publicRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/not-authorized",
    element: <UnauthorizedPage />,
  },
];

const protectedRoutes: RouteObject[] = [
  {
    path: FRONTENDROUTES.HOME,
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "components", element: <ComponentsIndex /> },
      { path: FRONTENDROUTES.CUSTOMER, element: <CustomerPageIndex /> },
      { path: FRONTENDROUTES.ORDERS, element: <OrderPageIndex /> },
      { path: FRONTENDROUTES.PROFILE.substring(1), element: <ProfilePage /> },
      { path: FRONTENDROUTES.CATEGORY, element: <CategoryPageIndex /> },
      { path: "menu/categories", element: <div>Menu Categories</div> },
      { path: "menu/items", element: <div>Menu Items</div> },
      { path: "menu/add-item", element: <AddMenuItemPage /> },
      { path: "menu/inventory", element: <div>Inventory</div> },
    ],
  },
];

const notFoundRoute: RouteObject = {
  path: "*",
  element: <NotFoundPage />,
};

const routes: RouteObject[] = [...publicRoutes, ...protectedRoutes, notFoundRoute];

export { routes };