import { RouteWrapper } from "../routes/RouteWrapper";
import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <RouteWrapper isAuthenticationPage requiredRole="none">
      <div className="auth-layout">
        <div className="auth-layout__bg-image" />
        <div className="auth-layout__form-container">
          <div className="auth-layout__form">
            <Outlet />
          </div>
        </div>
      </div>
    </RouteWrapper>
  );
};
