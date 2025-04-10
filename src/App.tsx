import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";

import AuthContextProvider from "./store/auth-context";
import { router } from "./routes/Routes";

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
      <ToastContainer />
    </QueryClientProvider>
  );
}
