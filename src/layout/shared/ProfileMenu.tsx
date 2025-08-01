import React from "react";
import {
  Avatar,
  Menu,
  UnstyledButton,
  Group,
} from "@mantine/core";
import { CustomText } from "../../components/ui";
import {
  IconUser,
  IconSettings,
  IconLogout,
  IconChevronDown,
} from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../redux/useAuth";
import { useNavigate } from "react-router-dom";
import { FRONTENDROUTES } from "../../constants/frontendRoutes";
import { logout } from "../../server-action/authSlice";
import { useDispatch } from "react-redux";

interface ProfileMenuProps {
  isMobile: boolean;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ isMobile }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <Menu shadow="md" width={200} position="bottom-end" zIndex={9999}>
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
              <CustomText size="md" fontWeight={500} color="primary">
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
          <CustomText size="md">{user?.email}</CustomText>
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
  );
};

export default ProfileMenu;
