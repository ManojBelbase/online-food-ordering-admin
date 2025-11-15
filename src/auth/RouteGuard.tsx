import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRolePermissions } from "../hooks/useRolePermission";
import { FRONTENDROUTES } from "../constants/frontendRoutes";
import { useAuth } from "../redux/useAuth";
import { LoadingOverlay } from "@mantine/core";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { hasPermission } = useRolePermissions();
  const location = useLocation();
  const { isInitialized } = useAuth();

  if (!isInitialized) {
    return <LoadingOverlay visible />;
  }

  const hasAccess = hasPermission(location.pathname);
  
  if (!hasAccess) {
    console.log("🚫 Authorization failed:", {
      pathname: location.pathname,
      hasPermission: hasAccess,
    });
  }

  if (!hasAccess) {
    return <Navigate to={FRONTENDROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
