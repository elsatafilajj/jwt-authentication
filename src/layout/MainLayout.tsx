import { Sidebar } from "lucide-react";
import { RouteWrapper } from "../routes/RouteWrapper";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <RouteWrapper isAuthenticationPage={false}>
      {/* <Headers/> */}

      <Sidebar />

      <div className="page-wrapper">
        <Outlet />
      </div>
    </RouteWrapper>
  );
};
