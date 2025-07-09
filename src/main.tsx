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
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import {  appStore, persistor } from "./redux/store/store";
import LoadingSpinner from "./components/GlobalComponents/LoadingSpinner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={appStore}>
        <ThemeProvider>
          <MantineThemeProvider>
            <PersistGate
              loading={
                <LoadingSpinner
                  variant="detailed"
                  message="Initializing Food Ordering Admin..."
                  fullScreen={true}
                />
              }
              persistor={persistor}
            >
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
            </PersistGate>
          </MantineThemeProvider>
        </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
