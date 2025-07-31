import React, { useEffect } from "react";
import { Box, UnstyledButton, Tooltip, Collapse } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useRolePermissions } from "../../hooks/useRolePermission";
import { sidebarLinks } from "../../routes/SidebarLinks";
import { CustomText } from "../../components/ui";

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
  const filteredLinks = filterItemsByRole(sidebarLinks);

  useEffect(() => {
    filteredLinks.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some((child: any) =>
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
    <Box style={{ padding: isCollapsed ? '8px 4px' : '8px 0' }}>
      {filteredLinks.map((item) => {
        const Icon = item.icon;

        const filteredChildren = (item.children || []).filter(
          (child: any) => hasPermission(child.to)
        );

        const isDirectMatch = location.pathname === item.to;
        const isChildMatch = filteredChildren.some(
          (child: any) =>
            location.pathname === child.to ||
            location.pathname.startsWith(child.to + "/")
        );
        const isActive = isDirectMatch || isChildMatch;

        return (
          <Box key={item.label} style={{ marginBottom: '4px' }}>
            {isCollapsed ? (
              <Tooltip label={item.label} position="right">
                <UnstyledButton
                  style={{
                    width: '100%',
                    height: '40px',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "2px",
                    backgroundColor: isActive ? theme.colors.sidebarActive || '#e3f2fd' : "transparent",
                    color: isActive ? theme.colors.sidebarTextActive || '#1976d2' : theme.colors.sidebarText || '#6c757d',
                    borderRadius: "2px",
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      backgroundColor: isActive ? theme.colors.sidebarActive || '#e3f2fd' : theme.colors.sidebarHover || '#f8f9fa'
                    }
                  }}
                  onClick={() => {
                    const targetPath = filteredChildren[0]?.to || item.to;
                    if (hasPermission(targetPath)) {
                      window.location.href = targetPath;
                    }
                  }}
                >
                  {Icon && <Icon size={18} />}
                </UnstyledButton>
              </Tooltip>
            ) : item.children && filteredChildren.length > 0 ? (
              <>
                <UnstyledButton
                  style={{
                    width: '100%',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '1px',
                    backgroundColor: isActive ? theme.colors.sidebarActive || '#e3f2fd' : 'transparent',
                    borderRadius: '6px',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleDropdown(item.label)}
                >
                  {Icon && <Icon size={16} style={{
                    color: isActive ? theme.colors.sidebarTextActive || '#1976d2' : theme.colors.sidebarText || '#6c757d'
                  }} />}
                  <CustomText
                    fontSize="16px"
                    fontWeight={400}
                    color={isActive ? 'info' : 'primary'}
                    style={{ flex: 1 }}
                  >
                    {item.label}
                  </CustomText>
                  <IconChevronDown
                    size={14}
                    style={{
                      color: theme.colors.textSecondary || '#6c757d',
                      transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                    }}
                  />
                </UnstyledButton>

                <Collapse in={openDropdown === item.label}>
                  <Box style={{ paddingLeft: '24px', marginBottom: '4px' }}>
                    {filteredChildren.map((child: any) => {
                      const isChildActive = location.pathname.startsWith(child.to);
                      return (
                        <UnstyledButton
                          key={child.to}
                          component={RouterNavLink}
                          to={child.to}
                          style={{
                            width: '100%',
                            padding: '6px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            marginBottom: '1px',
                            backgroundColor: isChildActive ? theme.colors.sidebarActive || '#e3f2fd' : 'transparent',
                            borderRadius: '4px',
                            transition: 'all 0.15s ease',
                            textDecoration: 'none'
                          }}
                        >
                          <Box
                            style={{
                              width: '4px',
                              height: '4px',
                              backgroundColor: isChildActive ? theme.colors.sidebarTextActive || '#1976d2' : theme.colors.textSecondary || '#6c757d',
                              borderRadius: '50%',
                            }}
                          />
                          <CustomText
                            fontSize="16px"
                            fontWeight={400}
                            color={isChildActive ? 'info' : 'primary'}
                          >
                            {child.label}
                          </CustomText>
                        </UnstyledButton>
                      );
                    })}
                  </Box>
                </Collapse>
              </>
            ) : !item.children && hasPermission(item.to) ? (
              <UnstyledButton
                component={RouterNavLink}
                to={item.to}
                style={{
                  width: '100%',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '1px',
                  backgroundColor: isActive ? theme.colors.sidebarActive || '#e3f2fd' : 'transparent',
                  borderRadius: '6px',
                  transition: 'all 0.15s ease',
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                {Icon && <Icon size={16} style={{
                  color: isActive ? theme.colors.sidebarTextActive || '#1976d2' : theme.colors.sidebarText || '#6c757d'
                }} />}
                <CustomText
                  fontSize="16px"
                  fontWeight={500}
                  color={isActive ? 'info' : 'primary'}
                >
                  {item.label}
                </CustomText>
              </UnstyledButton>
            ) : null}
          </Box>
        );
      })}
    </Box>
  );
};