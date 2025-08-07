import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./shared/Sidebar";
import Navbar from "./shared/Navbar";
import { useTheme } from "../contexts/ThemeContext";

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet };
};

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { theme } = useTheme();
  const { isMobile, isTablet } = useResponsive();

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else if (isTablet) {
      setIsSidebarOpen(false); // Show icons only on tablet by default
    } else {
      setIsSidebarOpen(true); // Open sidebar on desktop by default
    }
  }, [isMobile, isTablet]);

  const getSidebarWidth = () => {
    if (isMobile) {
      return isSidebarOpen ? 64 : 0;
    }
    if (isTablet) {
      return 64; 
    }
    return isSidebarOpen ? 280 : 64;
  };

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
    >
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: getSidebarWidth(),
          transition: "margin-left 0.3s ease",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Navbar onHamburgerClick={toggleSidebar} />
        <main
          style={{
            flex: 1,
            padding: isMobile ? "10px 8px 8px 8px" : "0 6px 6px 6px",
            marginTop: isMobile ? "0" : "10px",
            color: theme.colors.textPrimary,
            backgroundColor: theme.colors.background,
            transition: "color 0.3s ease, background-color 0.3s ease",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
