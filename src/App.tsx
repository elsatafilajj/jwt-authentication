import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Signup from "./components/Signup";
import { ToastContainer } from "react-toastify";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";

const router = createBrowserRouter([
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);

export default function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
    </QueryClientProvider>
  );
}
