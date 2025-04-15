import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { RouteWrapper } from "@/routes/RouteWrapper";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <RouteWrapper isAuthenticationPage={false} requiredRole="user">
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto p-4 bg-gray-50">
            <Outlet />
          </main>
        </div>
      </div>
    </RouteWrapper>
  );
};
