import React, { useEffect } from "react";
import { NavLink, Tooltip } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useRolePermissions } from "../../hooks/useRolePermission";
import { sidebarLinks } from "../../routes/SidebarLinks";

interface Props {
  isCollapsed: boolean;
  openDropdown: string | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
}

export const SidebarLinksList: React.FC<Props> = ({
  isCollapsed,
  openDropdown,
  setOpenDropdown,
}) => {
  const location = useLocation();
  const { theme } = useTheme();
  const { filterItemsByRole, hasPermission } = useRolePermissions();

  // Filter sidebar links based on user permissions
  const filteredLinks = filterItemsByRole(sidebarLinks);

  useEffect(() => {
    filteredLinks.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child:any) =>
          location.pathname.startsWith(child.to)
        );
        if (isChildActive) setOpenDropdown(item.label);
      }
    });
  }, [location.pathname, filteredLinks]);

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {filteredLinks.map((item) => {
        const Icon = item.icon;
        
        // Filter children based on permissions
        const filteredChildren = (item.children || []).filter(
          (child:any) => hasPermission(child.to)
        );
        
        const isDirectMatch = location.pathname === item.to;
        const isChildMatch = filteredChildren.some(
          (child:any) =>
            location.pathname === child.to ||
            location.pathname.startsWith(child.to + "/")
        );
        const isActive = isDirectMatch || isChildMatch;

        return (
          <div key={item.label}>
            {isCollapsed ? (
              <Tooltip label={item.label} position="right">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "48px",
                    marginBottom: "5px",
                    backgroundColor: isActive ? theme.colors.sidebarActive : "transparent",
                    color: isActive ? theme.colors.sidebarTextActive : theme.colors.sidebarText,
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    const targetPath = filteredChildren[0]?.to || item.to;
                    if (hasPermission(targetPath)) {
                      window.location.href = targetPath;
                    }
                  }}
                >
                  {Icon && <Icon size={20} />}
                </div>
              </Tooltip>
            ) : item.children && filteredChildren.length > 0 ? (
              <>
                <NavLink
                  label={item.label}
                  leftSection={Icon ? <Icon size={16} /> : undefined}
                  rightSection={
                    <IconChevronDown
                      size={16}
                      style={{
                        transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  }
                  onClick={() => toggleDropdown(item.label)}
                  active={isActive}
                  styles={{
                    root: {
                      color: isActive ? theme.colors.sidebarTextActive : theme.colors.sidebarText,
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
                {openDropdown === item.label &&
                  filteredChildren.map((child:any) => {
                    const isChildActive = location.pathname.startsWith(child.to);
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
            ) : !item.children && hasPermission(item.to) ? (
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
            ) : null}
          </div>
        );
      })}
    </div>
  );
};