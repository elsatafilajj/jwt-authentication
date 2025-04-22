import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";

import AuthContextProvider from "./store/auth-context";
import { router } from "./routes/Routes";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function App() {
  const queryClient = new QueryClient({
    //   defaultOptions: {
    //     queries: {
    //       refetchOnWindowFocus: false, // default is true
    //     },
    //   },
  });
  return (
    <DndProvider backend={HTML5Backend}>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <RouterProvider router={router} />
          <ToastContainer />
        </AuthContextProvider>
      </QueryClientProvider>
    </DndProvider>
  );
}
