import React from "react";
import { createBrowserRouter, RouteObject } from "react-router-dom";
import { RouteNames } from "../constants/RouteNames";

import { AuthLayout } from "../layout/AuthLayout";
import { MainLayout } from "../layout/MainLayout";

import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import Dashboard from "../components/Rooms/Dashboard";
import Error404 from "../components/Error/Error404";
import AdminDashboard from "../components/Rooms/AdminDashboard";
import StickyNotes from "../components/Rooms/StickyNotes";

import { AdminLayout } from "../layout/AdminLayout";
import Profile from "../components/Authentication/Profile";

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
      { path: RouteNames.Profile, element: <Profile /> },
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
