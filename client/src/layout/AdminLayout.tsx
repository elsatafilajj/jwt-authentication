import React from "react";

import { RouteWrapper } from "../routes/RouteWrapper";
import { Outlet } from "react-router-dom";

export const AdminLayout = () => {
  return (
    <RouteWrapper isAuthenticationPage={false} requiredRole="admin">
      {/* <AdminHeader /> */}
      {/* <AdminSidebar /> */}

      <div className="admin-page-wrapper">
        <Outlet />
      </div>
    </RouteWrapper>
  );
};
