import { Outlet } from "react-router-dom";

import "./AuthLayout.css";
import { RouteWrapper } from "../routes/RouteWrapper";

export const AuthLayout = () => {
  return (
    // <RouteWrapper isAuthenticationPage>
    <RouteWrapper>
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
