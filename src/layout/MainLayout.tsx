import Header from "@/components/Header";
import { RouteWrapper } from "@/routes/RouteWrapper";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <RouteWrapper isAuthenticationPage={false} requiredRole="user">
      <Header />
      {/* <Sidebar /> */}

      <div className="page-wrapper">
        <Outlet />
      </div>
    </RouteWrapper>
  );
};
