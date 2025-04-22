import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
<<<<<<< HEAD:src/main.tsx
// import AuthContextProvider from "./store/auth-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <AuthContextProvider> */}
    <App />
    {/* </AuthContextProvider> */}
=======

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
>>>>>>> a20551e096627d8583b5e67f71b2748b8bd5385e:client/src/main.tsx
  </StrictMode>
);
