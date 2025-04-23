import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";

import AuthContextProvider from "./store/auth-context";
import { router } from "./routes/Routes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SocketProvider } from "./store/socket-context";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <DndProvider backend={HTML5Backend}>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <AuthContextProvider>
            <RouterProvider router={router} />
          </AuthContextProvider>
        </SocketProvider>
        <ToastContainer />
      </QueryClientProvider>
    </DndProvider>
  );
}
