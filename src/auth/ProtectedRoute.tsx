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
  
  // Only fetch restaurant data if user is RESTAURANT role and not on onboarding page (optimization)
  const isRestaurantRole = user?.role === Roles.RESTAURANT;
  const isOnOnboardingPage = location.pathname === FRONTENDROUTES.RESTAURANT_ONBOARDING;
  const shouldCheckRestaurant = isRestaurantRole && !isOnOnboardingPage;
  const { restaurant, isLoading } = useRestaurantByUser(shouldCheckRestaurant);
  
  if (!user) {
    return (
      <Navigate to={FRONTENDROUTES.LOGIN} state={{ from: location }} replace />
    );
  }

  // Only check restaurant for RESTAURANT role users and not on onboarding page
  if (shouldCheckRestaurant) {
    if (isLoading) return <LoadingOverlay visible />;

    if (!restaurant || Object.keys(restaurant).length === 0) {
      return <Navigate to={FRONTENDROUTES.RESTAURANT_ONBOARDING} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
