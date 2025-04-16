import { useAuth } from "@/store/auth-context";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RouteWrapperProps {
  children: ReactNode;
  requiredRole: string;
  isAuthenticationPage: boolean;
}

export const RouteWrapper = ({
  children,
  requiredRole,
  isAuthenticationPage = false,
}: RouteWrapperProps) => {
  const { isAuthenticated, userRole, isLoading } = useAuth();

  if (isAuthenticated && isAuthenticationPage) {
    if (userRole === "admin") {
      return <Navigate to="/adminDashboard" />;
    } else if (userRole === "user") {
      return <Navigate to="/dashboard" />;
    }
  }

  if (!isAuthenticated && !isAuthenticationPage && !isLoading) {
    return <Navigate to="/login" />;
  }

  if (
    isAuthenticated &&
    requiredRole &&
    userRole !== requiredRole &&
    !isAuthenticationPage
  ) {
    return (
      <Navigate to={userRole === "admin" ? "/adminDashboard" : "/dashboard"} />
    );
  }
  console.log({ isAuthenticated, userRole, isLoading });

  return <>{children}</>;
};
