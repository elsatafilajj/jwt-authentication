import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { RouteNames } from "../constants/RouteNames";

import { AuthLayout } from "../layout/AuthLayout";
import { MainLayout } from "../layout/MainLayout";

import Login from "../components/Login";
import Signup from "../components/Signup";
import Dashboard from "../components/Dashboard";
import Error404 from "../components/Error404";
import AdminDashboard from "../components/AdminDashboard";

import { AdminLayout } from "../layout/AdminLayout";
import StickyNotes from "../components/StickyNotes";

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
      { path: RouteNames.Dashboard, element: <Dashboard /> },
      { path: RouteNames.StickyNotes, element: <StickyNotes /> },
    ],
  },
  {
    element: <AdminLayout />,
    children: [
      { path: RouteNames.AdminDashboard, element: <AdminDashboard /> },
    ],
  },

  {
    path: "*",
    element: <Error404 />,
  },
];

export const router = createBrowserRouter(appRoutes);
