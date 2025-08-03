import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../redux/useAuth";
import { FRONTENDROUTES } from "../constants/frontendRoutes";
import { Roles } from "../constants/roles";
import { LoadingOverlay } from "@mantine/core";
import { useRestaurantByUser } from "../hooks/useRestaurantByUser";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { restaurant, isLoading } = useRestaurantByUser();
  console.log(restaurant,"red")
  
  if (!user) {
    return (
      <Navigate to={FRONTENDROUTES.LOGIN} state={{ from: location }} replace />
    );
  }

  if (user?.role === Roles.RESTAURANT) {
    if (isLoading) return <LoadingOverlay visible />;

    if (!restaurant || Object.keys(restaurant).length === 0) {
      return <Navigate to={FRONTENDROUTES.RESTAURANT_ONBOARDING} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
