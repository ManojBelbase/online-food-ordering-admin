import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute.tsx";
import RouteGuard from "../auth/RouteGuard.tsx";
import withSuspense, { withPageLoader } from "../utils/withSuspense";
import { FRONTENDROUTES } from "../constants/frontendRoutes.ts";
import CategoryPageIndex from "../pages/Category/CategoryPageIndex.tsx";
import CustomerPageIndex from "../pages/Customer/CustomerPageIndex.tsx";
import UnauthorizedPage from "../components/GlobalComponents/UnAuthorizedPage.tsx";
import GlobalCategoryIndex from "../pages/Global-Category/GlobalCategoryIndex.tsx";
import RestaurantOnboardingForm from "../pages/restaurant-onboarding/Components/RestaurantOnboardingForm.tsx";
import RestaurantPageIndex from "../pages/restaurant-onboarding/RestaurantPageIndex.tsx";
import FoodItemPageIndex from "../pages/FoodItem/FoodItemPageIndex.tsx";
import VerifyEmailPage from "../auth/verify-route.tsx";
import NewOrderPageIndex from "../pages/Orders/NewOrders/NewOrderPageIndex.tsx";

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

const LoginPage = withPageLoader(
  lazy(() => import("../pages/login/LoginPage.tsx")),
  "Loading login..."
);



const ProfilePage = withPageLoader(
  lazy(() => import("../pages/Profile/ProfilePage.tsx")),
  "Loading profile..."
);


const NotFoundPage = withSuspense(lazy(() => import("../components/GlobalComponents/NotFoundPage.tsx")), {
  message: "Page not found...",
  type: "custom",
});

const publicRoutes: RouteObject[] = [
  {
    path: FRONTENDROUTES.LOGIN,
    element: <LoginPage />,
  },
  {
    path: FRONTENDROUTES.NOT_AUTHORIZED,
    element: <UnauthorizedPage />,
  },
  {
    path: FRONTENDROUTES.VERIFY_EMAIL,
    element:<VerifyEmailPage/>
  }
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
      {
        path: FRONTENDROUTES.GLOBAL_CATEGORY.substring(1),
        element: <RouteGuard><GlobalCategoryIndex /></RouteGuard>
      },
      {
        path: FRONTENDROUTES.CATEGORY.substring(1),
        element: <RouteGuard><CategoryPageIndex /></RouteGuard>
      },
      {
        path: FRONTENDROUTES.CUSTOMER.substring(1),
        element: <RouteGuard><CustomerPageIndex /></RouteGuard>
      },
      {
        path: FRONTENDROUTES.RESTAURANT.substring(1),
        element: <RouteGuard><RestaurantPageIndex /></RouteGuard>
      },

      { path: FRONTENDROUTES.PROFILE.substring(1), element: <ProfilePage /> },
      {
        path: FRONTENDROUTES.FOOD_ITEM.substring(1),
        element: <RouteGuard><FoodItemPageIndex /></RouteGuard>
      },

      {
        path: FRONTENDROUTES.NEW_ORDERS.substring(1),
        element: <RouteGuard><NewOrderPageIndex /></RouteGuard>
      },

      { path: "menu/items", element: <div>Menu Items</div> },
    ],
  },
];

const notFoundRoute: RouteObject = {
  path: "*",
  element: <NotFoundPage />,
};

const restautantOnBoardingRoute: RouteObject=
  {
    path:FRONTENDROUTES.RESTAURANT_ONBOARDING,
    element:<RestaurantOnboardingForm />
  }



const routes: RouteObject[] = [...publicRoutes, ...protectedRoutes,restautantOnBoardingRoute, notFoundRoute];

export { routes };