import React, { useState, useEffect } from "react";
import { NavLink, Group, Avatar, Text } from "@mantine/core";
import { IconChevronDown, IconHotelService } from "@tabler/icons-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { sidebarLinks } from "./components/sidebarLinks";
import { useTheme } from "../../contexts/ThemeContext";


interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { theme } = useTheme();


  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  // Auto-open dropdown if current route is a child route
  useEffect(() => {
    sidebarLinks.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) =>
            location.pathname === child.to ||
            location.pathname.startsWith(child.to + "/")
        );
        if (isChildActive) {
          setOpenDropdown(item.label);
        }
      }
    });
  }, [location.pathname]);

  return (
    <div
      style={{
        backgroundColor: theme.colors.sidebarBackground,
        height: "100vh",
        width: isOpen ? "300px" : "0px",
        transition: "width 0.3s ease, background-color 0.3s ease",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        boxShadow: isOpen ? theme.shadows.lg : "none",
      }}
    >
      <NavLink
        component={RouterNavLink}
        to="/"
        label="Online Food Ordering"
        leftSection={<IconHotelService size={16} />}
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

      <div style={{ marginTop: "10px" }}>
        {sidebarLinks.map((item) => {
          // Check if current route matches this item or any of its children
          const isDirectMatch = location.pathname === item.to;
          const isChildMatch = item.children?.some(
            (child) =>
              location.pathname === child.to ||
              location.pathname.startsWith(child.to + "/")
          );
          const isActive = isDirectMatch || isChildMatch;
          const Icon = item.icon;

          return (
            <div key={item.label}>
              {item.children ? (
                <NavLink
                  label={item.label}
                  leftSection={Icon && <Icon size={16} />}
                  rightSection={
                    <IconChevronDown
                      size={16}
                      style={{
                        transform:
                          openDropdown === item.label
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  }
                  onClick={() => toggleDropdown(item.label)}
                  active={isActive}
                  styles={{
                    root: {
                      color: isActive
                        ? theme.colors.sidebarTextActive
                        : theme.colors.sidebarText,
                      marginBottom: "5px",
                      backgroundColor: isActive
                        ? theme.colors.sidebarActive
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isActive
                          ? theme.colors.sidebarActive
                          : theme.colors.sidebarHover,
                      },
                      cursor: "pointer",
                    },
                  }}
                />
              ) : (
                <NavLink
                  component={RouterNavLink}
                  to={item.to}
                  label={item.label}
                  leftSection={Icon && <Icon size={16} />}
                  active={isActive}
                  styles={{
                    root: {
                      color: isActive
                        ? theme.colors.sidebarTextActive
                        : theme.colors.sidebarText,
                      marginBottom: "5px",
                      backgroundColor: isActive
                        ? theme.colors.sidebarActive
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isActive
                          ? theme.colors.sidebarActive
                          : theme.colors.sidebarHover,
                      },
                    },
                  }}
                />
              )}

              {item.children && openDropdown === item.label && (
                <>
                  {item.children.map((child) => {
                    const isChildActive =
                      location.pathname === child.to ||
                      location.pathname.startsWith(child.to + "/");
                    return (
                      <NavLink
                        key={child.to}
                        component={RouterNavLink}
                        to={child.to}
                        label={child.label}
                        active={isChildActive}
                        styles={{
                          root: {
                            paddingLeft: "20px",
                            color: isChildActive
                              ? theme.colors.sidebarTextActive
                              : theme.colors.sidebarText,
                            backgroundColor: isChildActive
                              ? theme.colors.sidebarActive
                              : "transparent",
                            "&:hover": {
                              backgroundColor: isChildActive
                                ? theme.colors.sidebarActive
                                : theme.colors.sidebarHover,
                            },
                          },
                        }}
                      />
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
      </div>

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
          <Avatar
            src="https://via.placeholder.com/40"
            radius="xl"
          />
          <div>
            <Text style={{ color: theme.colors.sidebarText }}>
              Admin User
            </Text>
            <Text size="xs" style={{ color: theme.colors.primary }}>
              admin@example.com
            </Text>
          </div>
        </Group>
      </div>
    </div>
  );
};

export default Sidebar;
