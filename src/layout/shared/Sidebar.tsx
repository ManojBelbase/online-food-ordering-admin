// components/layouts/Sidebar.tsx
import React, { useState } from "react";
import { Tooltip, NavLink, Group, Avatar, Text } from "@mantine/core";
import { IconHotelService } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useResponsive } from "../../styles/useResponsive";
import { SidebarLinksList } from "./SidebarLinksList";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { theme } = useTheme();
  const { isMobile, isTablet } = useResponsive();

  const isCollapsed = isTablet && !isOpen;
  const isHidden = (isMobile && !isOpen) || (!isMobile && !isTablet && !isOpen);
  const sidebarWidth = isCollapsed ? 80 : 300;

  if (isHidden) return null;

  return (
    <div
      style={{
        backgroundColor: theme.colors.sidebarBackground,
        height: "100vh",
        width: `${sidebarWidth}px`,
        transition: "width 0.3s ease, background-color 0.3s ease",
        overflow: isCollapsed ? "visible" : "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        boxShadow: theme.shadows.lg,
      }}
    >
      {isCollapsed ? (
        <Tooltip label="Online Food Ordering" position="right">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "60px",
              color: theme.colors.sidebarText,
              cursor: "pointer",
            }}
            onClick={() => window.location.href = "/"}
          >
            <IconHotelService size={24} />
          </div>
        </Tooltip>
      ) : (
        <NavLink
          label="Online Food Ordering"
          leftSection={<IconHotelService size={16} />}
          href="/"
          styles={{
            root: {
              color: theme.colors.sidebarText,
              fontSize: "16px",
              padding: "10px",
              "&:hover": {
                backgroundColor: theme.colors.sidebarHover,
              },
            },
          }}
        />
      )}

      <SidebarLinksList
        isCollapsed={isCollapsed}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />

      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: "10px",
          borderTop: `1px solid ${theme.colors.border}`,
          backgroundColor: theme.colors.sidebarBackground,
        }}
      >
        <Group gap="xs">
          <Avatar src="https://via.placeholder.com/40" radius="xl" />
          <div>
            <Text style={{ color: theme.colors.sidebarText }}>Admin User</Text>
            <Text size="xs" style={{ color: theme.colors.primary }}>admin@example.com</Text>
          </div>
        </Group>
      </div>
    </div>
  );
};

export default Sidebar;
