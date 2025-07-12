import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./shared/Sidebar";
import Navbar from "./shared/Navbar";
import { useTheme } from "../contexts/ThemeContext";

// Custom hook for responsive behavior
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

  // Calculate sidebar width based on screen size and state
  const getSidebarWidth = () => {
    if (isMobile) {
      return isSidebarOpen ? 300 : 0; // Full width or completely hidden on mobile
    }
    if (isTablet) {
      return isSidebarOpen ? 300 : 80; // Full width or icons only on tablet
    }
    // Desktop: completely close when toggled off
    return isSidebarOpen ? 300 : 0; // Full width or completely hidden on desktop
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
            padding: "0 10px 10px 10px",
            marginTop: "14px",
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
