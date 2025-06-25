import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./shared/Sidebar";
import Navbar from "./shared/Navbar";

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#1A1B1E",
      }}
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: isSidebarOpen ? 300 : 0,
          transition: "margin-left 0.3s",
        }}
      >
        <Navbar onHamburgerClick={toggleSidebar} />
        <main
          style={{
            flex: 1,
            padding: "20px",
            overflowY: "auto",
            color: "white",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
