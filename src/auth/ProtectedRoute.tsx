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

  // Not logged in
  if (!user) {
    return (
      <Navigate to={FRONTENDROUTES.LOGIN} state={{ from: location }} replace />
    );
  }

  // If user is RESTAURANT role
  if (user?.role === Roles.RESTAURANT) {
    if (isLoading) return <LoadingOverlay visible />;

    if (!restaurant || Object.keys(restaurant).length === 0) {
      // No restaurant yet — go to onboarding
      return <Navigate to={FRONTENDROUTES.RESTAURANT_ONBOARDING} replace />;
    } else {
      return <>{children}</>;
    }
  }

  // Permission check
  if (!hasPermission(location.pathname)) {
    return <Navigate to="/not-authorized" replace />;
  }

  // All good — render the page
  return <>{children}</>;
};

export default ProtectedRoute;
