import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../redux/useAuth";
import { useRolePermissions } from "../hooks/useRolePermission";
import { FRONTENDROUTES } from "../constants/frontendRoutes";
import { Roles } from "../constants/roles";
import { LoadingOverlay } from "@mantine/core";
import { useRestaurantByUser } from "../hooks/useRestaurantByUser";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const { hasPermission } = useRolePermissions();
  const location = useLocation();

  const { restaurant, isLoading } = useRestaurantByUser();

  // 1. Redirect unauthenticated users
  if (!user) {
    return <Navigate to={FRONTENDROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // 2. For RESTAURANT role: ensure restaurant is registered
  if (user?.role === Roles.RESTAURANT) {
    if (isLoading) return <LoadingOverlay />;
    if (!restaurant || Object.keys(restaurant).length === 0) {
      return <Navigate to={FRONTENDROUTES.RESTAURANT_ONBOARDING} />;
    }
  }

  // 3. If no permission for route
  if (!hasPermission(location.pathname)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
