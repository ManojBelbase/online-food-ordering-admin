import React, { useState } from "react";
import { Box, Group, Avatar, UnstyledButton } from "@mantine/core";
import { IconHotelService, IconChevronDown, IconLifebuoy } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useResponsive } from "../../styles/useResponsive";
import { SidebarLinksList } from "./SidebarLinksList";
import { CustomText, ActionButton } from "../../components/ui";

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
  const sidebarWidth = isCollapsed ? 60 : 300;

  if (isHidden) return null;

  return (
    <Box
      style={{
        backgroundColor: theme.colors.sidebarBackground || '#f8f9fa',
        height: "100vh",
        width: `${sidebarWidth}px`,
        transition: "width 0.2s ease",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
        borderRight: `1px solid ${theme.colors.border || '#e9ecef'}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box style={{
        padding: isCollapsed ? '12px 8px' : '16px 16px',
        borderBottom: `1px solid ${theme.colors.border || '#e9ecef'}`,
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start'
      }}>
        {isCollapsed ? (
          <IconHotelService
            size={24}
            style={{ color: theme.colors.textPrimary || '#212529' }}
          />
        ) : (
          <Group gap={8} style={{ cursor: 'pointer' }} onClick={() => window.location.href = "/"}>
            <IconHotelService
              size={20}
              style={{ color: theme.colors.textPrimary || '#212529' }}
            />
            <CustomText
              fontSize="14px"
              fontWeight={600}
              color="primary"
              
            >
              Food Ordering
            </CustomText>
            <IconChevronDown
              size={16}
              style={{
                color: theme.colors.textSecondary || '#6c757d',
                marginLeft: 'auto'
              }}
            />
          </Group>
        )}
      </Box>

      <Box style={{ flex: 1, overflow: 'hidden' }}>
        <SidebarLinksList
          isCollapsed={isCollapsed}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />
      </Box>

      <Box style={{
        borderTop: `1px solid ${theme.colors.border || '#e9ecef'}`,
        padding: isCollapsed ? '8px' : '12px 16px'
      }}>
        {!isCollapsed && (
          <>
            <UnstyledButton
              style={{
                width: '100%',
                padding: '8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}
            >
              <IconLifebuoy size={16} style={{ color: theme.colors.textSecondary || '#6c757d' }} />
              <CustomText
                size="sm"
                fontSize="13px"
                fontWeight={500}
                color="secondary"
              >
                Need support?
              </CustomText>
            </UnstyledButton>

            <CustomText
              size="xs"
              fontSize="11px"
              color="secondary"
              margin="0 0 8px 0"
            >
              Get in touch with our agents
            </CustomText>

            <ActionButton
              variant="primary"
              size="xs"
              width="100%"
              fontSize="11px"
              style={{ marginBottom: '12px' }}
            >
              Contact us
            </ActionButton>
          </>
        )}



        <Group gap={isCollapsed ? 0 : 8} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
          <Avatar size={isCollapsed ? 32 : 28} radius="sm" />
          {!isCollapsed && (
            <Box style={{ flex: 1 }}>
              <CustomText
                fontSize="12px"
                fontWeight={500}
                color="primary"
                lineHeight={1.2}
              >
                Admin User
              </CustomText>
              <CustomText
                size="xs"
                fontSize="11px"
                color="secondary"
                lineHeight={1.2}
              >
                admin@example.com
              </CustomText>
            </Box>
          )}
        </Group>
      </Box>
    </Box>
  );
};

export default Sidebar;
