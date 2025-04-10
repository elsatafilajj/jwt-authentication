import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// import { UserRole } from '@/api/User/user.types';
// import logo from "@/assets/images/logo.svg";
import { useAuth } from "../store/auth-context";

interface RouteWrapperProps {
  children: ReactNode;
  isAuthenticationPage?: boolean;
}

export const RouteWrapper = ({
  children,
  isAuthenticationPage = false,
}: RouteWrapperProps) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated && isAuthenticationPage) {
    return <Navigate to={"/dashboard"} />;
  }

  if (!isAuthenticated && !isAuthenticationPage) {
    return <Navigate to={"/login"} />;
  }

  // if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
  //   return <Navigate to="/" replace />;
  // }

  return <>{children}</>;
};
