import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import App from "./App";
import "@mantine/core/styles.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <Notifications position="top-right" zIndex={2077} />
      <BrowserRouter>
        <Notifications position="top-right" zIndex={2077} />
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);
