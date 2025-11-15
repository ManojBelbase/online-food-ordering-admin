import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../redux/useAuth";
import { FRONTENDROUTES } from "../constants/frontendRoutes";
import { Roles } from "../constants/roles";
import { LoadingOverlay } from "@mantine/core";

interface OnboardingRouteGuardProps {
  children: React.ReactNode;
}

const OnboardingRouteGuard: React.FC<OnboardingRouteGuardProps> = ({ children }) => {
  const { user, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return <LoadingOverlay visible />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Navigate to={FRONTENDROUTES.LOGIN} state={{ from: location }} replace />
    );
  }

  // Only allow RESTAURANT role users to access onboarding
  if (user.role !== Roles.RESTAURANT) {
    return <Navigate to={FRONTENDROUTES.NOT_AUTHORIZED} replace />;
  }

  return <>{children}</>;
};

export default OnboardingRouteGuard;
