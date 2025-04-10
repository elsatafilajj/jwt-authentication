import { RouteWrapper } from "@/utils/RouteWrapper";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <RouteWrapper isAuthenticationPage={false}>
      <div className="page-wrapper">
        <Outlet />
      </div>
    </RouteWrapper>
  );
};
