import { Outlet } from "react-router-dom";

// import { Header } from "../components/Header";
// import { Sidebar } from "../components/Sidebar";
import { RouteWrapper } from "../routes/RouteWrapper";

export const MainLayout = () => {
  return (
    <RouteWrapper>
      {/* <Header /> */}
      {/* <Sidebar /> */}

      <div className="page-wrapper">
        <Outlet />
      </div>
    </RouteWrapper>
  );
};
