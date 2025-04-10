import { useAuth } from "@/store/auth-context";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RouteWrapperProps {
  children: ReactNode;
  isAuthenticationPage: boolean;
}

export const RouteWrapper = ({
  children,
  isAuthenticationPage = true,
}: RouteWrapperProps) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated && isAuthenticationPage) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated && !isAuthenticationPage) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
