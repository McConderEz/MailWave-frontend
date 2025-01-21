import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider } from "@emotion/react";
import { darkTheme } from "./theme";
import { router } from "./app/router";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/auth/AuthContext";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={darkTheme}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </ThemeProvider>
);
