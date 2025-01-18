import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { ThemeProvider } from "@emotion/react";
import { darkTheme } from "./theme";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={darkTheme}>
    <App />
  </ThemeProvider>
);
