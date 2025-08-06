import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRolePermissions } from "../hooks/useRolePermission";
import { FRONTENDROUTES } from "../constants/frontendRoutes";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const { hasPermission } = useRolePermissions();
  const location = useLocation();

  if (!hasPermission(location.pathname)) {
    return <Navigate to={FRONTENDROUTES.NOT_AUTHORIZED} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
