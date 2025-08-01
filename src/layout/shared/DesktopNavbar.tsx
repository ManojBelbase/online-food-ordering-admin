import React from "react";
import { Group, Title, ActionIcon, TextInput } from "@mantine/core";
import { IconMenu2, IconSearch } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";
import VoiceNavigation from "../../components/VoiceNavigation";
import ProfileMenu from "./ProfileMenu";
import NotificationMenu from "./NotificationMenu";

interface DesktopNavbarProps {
  onHamburgerClick: () => void;
  isTablet: boolean;
}

const DesktopNavbar: React.FC<DesktopNavbarProps> = ({ onHamburgerClick, isTablet }) => {
  const { theme } = useTheme();

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
        overflow: "visible",
      }}
    >
      {/* Left side - Menu and Title */}
      <Group gap="xs" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
        <ActionIcon
          variant="subtle"
          onClick={onHamburgerClick}
          style={{ color: theme.colors.textSecondary, flexShrink: 0 }}
        >
          <IconMenu2 size={24} />
        </ActionIcon>
        
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
      </Group>

      {/* Right side - Search and Actions */}
      <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
        {/* Search Input */}
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

        {/* Action Buttons */}
        <ThemeToggle />
        <VoiceNavigation />
        <NotificationMenu />
        <ProfileMenu isMobile={false} />
      </Group>
    </div>
  );
};

export default DesktopNavbar;
