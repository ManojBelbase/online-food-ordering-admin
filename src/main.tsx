import React from "react";
import ReactDOM from "react-dom/client";
import { Notifications } from "@mantine/notifications";
import App from "./App";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./styles/notifications.css";
import "./styles/global-theme.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { MantineThemeProvider } from "./components/MantineThemeProvider";
import { ModalProvider } from "./contexts/ModalContext";
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <MantineThemeProvider>
            <ModalProvider>
              <Notifications
                position="top-right"
                zIndex={2077}
                limit={5}
                containerWidth={400}
                styles={{
                  notification: {
                    marginTop: '10px',
                    marginRight: '20px',
                  }
                }}
              />
              <App />
            </ModalProvider>
          </MantineThemeProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
