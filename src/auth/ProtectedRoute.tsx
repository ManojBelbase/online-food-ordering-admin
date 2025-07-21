// auth/ProtectedRoute.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../redux/useAuth";
import { useRolePermissions } from "../hooks/useRolePermission";
import { FRONTENDROUTES } from "../constants/frontendRoutes";
import { Roles } from "../constants/roles";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const { hasPermission } = useRolePermissions();
  const location = useLocation();

  if (!user) {
    return <Navigate to={FRONTENDROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if(user?.role===Roles.RESTAURANT){
    return <Navigate to={FRONTENDROUTES.RESTAURANT_ONBOARDING}/>
  }

  if (!hasPermission(location.pathname)) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;