import { useMemo, useRef, useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRolePermissions } from "../hooks/useRolePermission";
import { FRONTENDROUTES } from "../constants/frontendRoutes";
import { useAuth } from "../redux/useAuth";
import { LoadingOverlay } from "@mantine/core";

interface RouteGuardProps {
  children: ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const { hasPermission } = useRolePermissions(); 
  const location = useLocation();
  const { isInitialized } = useAuth();
  const navigatingRef = useRef(false);

  const isLoginPage = location.pathname === FRONTENDROUTES.LOGIN;

  const hasAccess = useMemo(() => {
    if (!isInitialized || isLoginPage) return true; 
    return hasPermission(location.pathname);
  }, [hasPermission, location.pathname, isInitialized, isLoginPage]);

  useEffect(() => {
    navigatingRef.current = false;
  }, [location.pathname]);

  if (!isInitialized) {
    return <LoadingOverlay visible />;
  }

  if (!hasAccess && !isLoginPage && !navigatingRef.current) {
    navigatingRef.current = true;
    return <Navigate to={FRONTENDROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RouteGuard;
