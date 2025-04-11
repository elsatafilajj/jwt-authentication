import { useAuth, userRoleType } from "@/store/auth-context";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RouteWrapperProps {
  children: ReactNode;
  isAuthenticationPage: boolean;
  allowedRoles?: userRoleType[];
}

export const RouteWrapper = ({
  children,
  isAuthenticationPage = true,
  allowedRoles,
}: RouteWrapperProps) => {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated && isAuthenticationPage) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated && !isAuthenticationPage) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
