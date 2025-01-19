import { createRoot } from "react-dom/client";
import "./index.css";
import Header, { App } from "./app/App";
import { ThemeProvider } from "@emotion/react";
import { darkTheme } from "./theme";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [{}],
  },
]);

export function RootLayout() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={darkTheme}>
    <RouterProvider router={router} />
  </ThemeProvider>
);
