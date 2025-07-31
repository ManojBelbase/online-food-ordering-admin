import React, { useState, useEffect } from "react";
import {
  Group,
  Title,
  ActionIcon,
  TextInput,
  Avatar,
  Menu,
  Divider,
  Badge,
  Indicator,
  UnstyledButton,
  Popover,
  Stack,
  ScrollArea,
} from "@mantine/core";
import { CustomText, ActionButton } from "../../components/ui";
import {
  IconMenu2,
  IconSearch,
  IconBell,
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronDown,
  IconNotification,
} from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../redux/useAuth";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import VoiceNavigation from "../../components/VoiceNavigation";
import { FRONTENDROUTES } from "../../constants/frontendRoutes";
import { logout } from "../../server-action/authSlice";

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

interface NavbarProps {
  onHamburgerClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHamburgerClick }) => {
  const { theme } = useTheme();
  const { isMobile, isTablet } = useResponsive();
  const { user, dispatch } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpened, setNotificationsOpened] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      message: "Order #1234 from John Doe",
      time: "2 minutes ago",
      read: false,
      type: "order",
    },
    {
      id: 2,
      title: "Payment Confirmed",
      message: "Payment for Order #1233 confirmed",
      time: "5 minutes ago",
      read: false,
      type: "payment",
    },
    {
      id: 3,
      title: "System Update",
      message: "System maintenance completed successfully",
      time: "1 hour ago",
      read: true,
      type: "system",
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
    } catch (error) {
      navigate("/login");
    }
  };

  const handleProfileClick = () => {
    navigate(FRONTENDROUTES.PROFILE);
  };

  return (
    <div
      style={{
        height: "70px",
        backgroundColor: theme.colors.navbarBackground,
        borderBottom: `1px solid ${theme.colors.navbarBorder}`,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        justifyContent: "space-between",
        transition: "all 0.3s ease",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        paddingBlock: "14px",
        flexWrap: "nowrap",
        minWidth: 0,
      }}
    >
      <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
        <ActionIcon
          variant="subtle"
          onClick={onHamburgerClick}
          style={{ color: theme.colors.textSecondary, flexShrink: 0 }}
        >
          <IconMenu2 size={24} />
        </ActionIcon>
        {!isMobile && (
          <Title
            order={3}
            style={{
              color: theme.colors.navbarText,
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {isTablet ? "Food Admin" : "Food Ordering Admin"}
          </Title>
        )}
      </Group>

      <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
        {!isMobile && (
          <TextInput
            placeholder="Search..."
            leftSection={<IconSearch size={18} />}
            styles={{
              input: {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.inputText,
                "&::placeholder": {
                  color: theme.colors.inputPlaceholder,
                },
                "&:focus": {
                  borderColor: theme.colors.primary,
                },
              },
            }}
            style={{
              width: isTablet ? "140px" : "180px",
              minWidth: isTablet ? "140px" : "180px",
              flexShrink: 0
            }}
          />
        )}
        {isMobile && (
          <ActionIcon
            variant="subtle"
            style={{ color: theme.colors.textSecondary, flexShrink: 0 }}
          >
            <IconSearch size={20} />
          </ActionIcon>
        )}

        <ThemeToggle />

        <VoiceNavigation />

        {/* Notifications */}
        <Popover
          width={320}
          position="bottom-end"
          withArrow
          shadow="md"
          opened={notificationsOpened}
          onChange={setNotificationsOpened}
        >
          <Popover.Target>
            <ActionIcon
              variant="subtle"
              style={{ color: theme.colors.textSecondary }}
              onClick={() => setNotificationsOpened(!notificationsOpened)}
            >
              <Indicator
                inline
                label={unreadCount > 0 ? unreadCount.toString() : undefined}
                size={16}
                color="red"
                disabled={unreadCount === 0}
                styles={{
                  indicator: {
                    fontSize: '10px',
                    fontWeight: 600,
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }
                }}
              >
                <IconBell size={20} />
              </Indicator>
            </ActionIcon>
          </Popover.Target>
          <Popover.Dropdown
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <Group justify="space-between" mb="sm">
              <CustomText fontWeight={600} color="primary">
                Notifications
              </CustomText>
              <Badge variant="light" size="sm">
                {unreadCount} new
              </Badge>
            </Group>
            <Divider mb="sm" />
            <ScrollArea.Autosize mah={300}>
              <Stack gap="xs">
                {notifications.map((notification) => (
                  <UnstyledButton
                    key={notification.id}
                    style={{
                      padding: "8px",
                      borderRadius: "6px",
                      backgroundColor: notification.read
                        ? "transparent"
                        : `${theme.colors.primary}10`,
                      border: `1px solid ${notification.read ? "transparent" : theme.colors.primary}20`,
                      width: "100%",
                    }}
                  >
                    <Group justify="space-between" align="flex-start">
                      <div style={{ flex: 1 }}>
                        <CustomText size="sm" fontWeight={500} color="primary">
                          {notification.title}
                        </CustomText>
                        <CustomText size="xs" color="secondary">
                          {notification.message}
                        </CustomText>
                        <CustomText size="xs" color="tertiary">
                          {notification.time}
                        </CustomText>
                      </div>
                      {!notification.read && (
                        <ActionIcon size="xs" variant="subtle">
                          <IconNotification size={12} />
                        </ActionIcon>
                      )}
                    </Group>
                  </UnstyledButton>
                ))}
              </Stack>
            </ScrollArea.Autosize>
            <Divider my="sm" />
            <Group justify="space-between">
              <ActionButton variant="ghost" size="xs">
                Mark all as read
              </ActionButton>
              <ActionButton
                variant="ghost"
                size="xs"
                onClick={() => {
                  setNotificationsOpened(false);
                  navigate('/notifications');
                }}
              >
                View all
              </ActionButton>
            </Group>
          </Popover.Dropdown>
        </Popover>

        {/* Profile Menu */}
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <UnstyledButton
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 8px",
                borderRadius: "8px",
                transition: "background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: theme.colors.surfaceHover,
                },
              }}
            >
              <Avatar
                src={user?.avatar}
                size={32}
                radius="xl"
              />
              {!isMobile && (
                <Group gap={4}>
                  <CustomText size="sm" fontWeight={500} color="primary">
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </CustomText>
                  <IconChevronDown size={14} style={{ color: theme.colors.textSecondary }} />
                </Group>
              )}
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            <Menu.Label style={{ color: theme.colors.textSecondary }}>
              <CustomText size="sm">{user?.email}</CustomText>
              {user?.role && (
                <CustomText size="xs" color="tertiary">
                  Role: {user?.role}
                </CustomText>
              )}
            </Menu.Label>
            <Menu.Item
              leftSection={<IconUser size={16} />}
              onClick={handleProfileClick}
              style={{ color: theme.colors.textPrimary }}
            >
              Profile Settings
            </Menu.Item>
            <Menu.Item
              leftSection={<IconSettings size={16} />}
              style={{ color: theme.colors.textPrimary }}
            >
              Account Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={<IconLogout size={16} />}
              onClick={handleLogout}
              style={{ color: theme.colors.error }}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </div>
  );
};

export default Navbar;