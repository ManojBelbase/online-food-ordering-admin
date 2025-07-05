import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./shared/Sidebar";
import Navbar from "./shared/Navbar";
import { useTheme } from "../contexts/ThemeContext";

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        transition: "background-color 0.3s ease",
      }}
      className="bg-red-400"
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: isSidebarOpen ? 300 : 0,
          transition: "margin-left 0.3s ease",
        }}
        className="gap-2"
      >
        <Navbar onHamburgerClick={toggleSidebar} />
        <main
          style={{
            flex: 1,
            padding: "10px",
            overflowY: "auto",
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.background,
            transition: "color 0.3s ease, background-color 0.3s ease",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
