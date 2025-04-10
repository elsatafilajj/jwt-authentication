import { createBrowserRouter, RouteObject } from "react-router-dom";
import { RouteNames } from "../constants/RouteNames";

import { AuthLayout } from "../layout/AuthLayout";
import { MainLayout } from "../layout/MainLayout";

import Login from "../components/Login";
import Signup from "../components/Signup";
import Dashboard from "../components/Dashboard";
import Error404 from "../components/Error404";

export const appRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: RouteNames.Login, element: <Login /> },
      { path: RouteNames.Signup, element: <Signup /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [{ index: true, element: <Dashboard /> }],
  },
  {
    path: "*",
    element: <Error404 />,
  },
];

export const router = createBrowserRouter(appRoutes);
