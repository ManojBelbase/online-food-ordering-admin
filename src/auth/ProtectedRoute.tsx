import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LoadingOverlay, Center } from "@mantine/core";
import { useAuth } from "../redux/useAuth";
import RoleBasedRoute from "../routes/RoleBasedRoute";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresRole?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresRole = true 
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <LoadingOverlay visible={true} />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresRole) {
    return (
      <RoleBasedRoute path={location.pathname}>
        {children}
      </RoleBasedRoute>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
