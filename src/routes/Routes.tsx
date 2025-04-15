import { createBrowserRouter, RouteObject } from "react-router-dom";
import { RouteNames } from "../constants/RouteNames";

import Error404 from "../components/Error404";

import { AuthLayout } from "../layout/AuthLayout";
import { MainLayout } from "../layout/MainLayout";
import { AdminLayout } from "@/layout/AdminLayout";

import Login from "../components/Login";
import Signup from "../components/Signup";

import Homepage from "../components/Homepage";
import AdminHomepage from "@/components/AdminHomepage";
import BrainstormDashboard from "@/components/BrainstormDashboard";

export const appRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: RouteNames.Login, element: <Login /> },
      { path: RouteNames.Signup, element: <Signup /> },
      { index: true, element: <Login /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: RouteNames.HomePage, element: <Homepage /> },
      {
        path: RouteNames.Brainstorm,
        element: <BrainstormDashboard />,
      },
    ],
  },
  {
    element: <AdminLayout />,
    children: [{ path: RouteNames.AdminHomepage, element: <AdminHomepage /> }],
  },

  {
    path: "*",
    element: <Error404 />,
  },
];

export const router = createBrowserRouter(appRoutes);
