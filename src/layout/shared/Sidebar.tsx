import React, { useState } from "react";
import { NavLink, Group, Avatar, Text } from "@mantine/core";
import { IconChevronDown, IconHotelService } from "@tabler/icons-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { sidebarLinks } from "./components/sidebarLinks";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <div
      style={{
        backgroundColor: "#25262B",
        height: "100vh",
        width: isOpen ? "300px" : "0px",
        transition: "width 0.3s ease",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      <NavLink
        component={RouterNavLink}
        to="/"
        label="Online Food Ordering"
        leftSection={<IconHotelService size={16} />}
        style={{ color: "#A3A5A7", fontSize: "16px", padding: "10px" }}
      />

      <div style={{ marginTop: "10px" }}>
        {sidebarLinks.map((item) => {
          const isActive =
            location.pathname === item.to ||
            location.pathname.startsWith(item.to + "/");
          const Icon = item.icon;

          return (
            <div key={item.label}>
              <NavLink
                component={RouterNavLink}
                to={item.to}
                label={item.label}
                leftSection={Icon && <Icon size={16} />}
                rightSection={
                  item.children ? (
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
                  ) : null
                }
                onClick={() => item.children && toggleDropdown(item.label)}
                active={isActive}
                style={{ color: "#A3A5A7", marginBottom: "5px" }}
              />

              {item.children && openDropdown === item.label && (
                <>
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      component={RouterNavLink}
                      to={child.to}
                      label={child.label}
                      style={{ paddingLeft: "20px", color: "#A3A5A7" }}
                      active={location.pathname === child.to}
                    />
                  ))}
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
          borderTop: "1px solid #333",
        }}
      >
        <Group gap="xs">
          <Avatar src="https://via.placeholder.com/40" radius="xl" />
          <div>
            <Text style={{ color: "#A3A5A7" }}>Harriette Spoonlicker</Text>
            <Text size="xs" style={{ color: "#5E81F4" }}>
              hspoonlicker@outlook.com
            </Text>
          </div>
        </Group>
      </div>
    </div>
  );
};

export default Sidebar;
