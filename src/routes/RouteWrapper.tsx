import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// import { UserRole } from "@/api/User/user.types";
import { useAuth } from "../store/auth-context";
// import { useAuthContext } from "@/context/AuthContext/AuthContext";

interface RouteWrapperProps {
  children: ReactNode;
  //   isAuthenticationPage?: boolean;
  //   allowedRoles?: UserRole[];
}

export const RouteWrapper = ({
  children,
}: //   isAuthenticationPage = false,
//   allowedRoles,
RouteWrapperProps) => {
  const { isAuthenticated } = useAuth();

  //   if (isLoading) {
  //     return (

  //       <div
  //         className="flex-center"
  //         style={{
  //           height: "100vh",
  //         }}
  //       >
  //         <img src={logo} alt="Logo" width={200} className="animate-pulse" />
  //       </div>
  //     );
  //   }

  //   if (isAuthenticated && isAuthenticationPage) {
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  //   if (!isAuthenticated && !isAuthenticationPage) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  //   if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
  //     return <Navigate to="/" replace />;
  //   }

  return <>{children}</>;
};
