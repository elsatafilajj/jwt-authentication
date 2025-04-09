import { createBrowserRouter, RouteObject } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { MainLayout } from "../layout/MainLayout";
import Dashboard from "../components/Dashboard";
import Error404 from "../components/Error404";
import { RouteNames } from "../constants/RouteNames";

export const appRoutes: RouteObject[] = [
  {
    element: <AuthLayout />,
    children: [
      { path: RouteNames.Login, element: <Login /> },
      { path: RouteNames.Signup, element: <Signup /> },
    ],
  },
  {
    path: RouteNames.Dashboard,
    element: <MainLayout />,
    children: [
      { index: true, element: <Dashboard /> },

      //   {
      //     path: RouteNames.Profile,
      //     element: <Profil />,
      //   },
      //   {
      //     path: RouteNames.Alert_Types,
      //     element: <AlertTypes />,
      //     children: [
      //       {
      //         index: true,
      //         element: <AlertTypesTable />,
      //       },
      //     ],
      //   },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
];

export const router = createBrowserRouter(appRoutes);
