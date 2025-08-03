import React from "react";
import { Group, ActionIcon, Title } from "@mantine/core";
import { IconMenu2, IconSearch } from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";
import VoiceNavigation from "../../components/VoiceNavigation";
import ProfileMenu from "./ProfileMenu";

interface MobileNavbarProps {
  onHamburgerClick: () => void;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ onHamburgerClick }) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        height: "70px",
        backgroundColor: theme.colors.navbarBackground,
        borderBottom: `1px solid ${theme.colors.navbarBorder}`,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
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
          order={4}
          style={{
            color: theme.colors.navbarText,
            fontWeight: 600,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "16px",
          }}
        >
          Food Admin
        </Title>
      </Group>

      {/* Right side - Actions */}
      <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
        <ActionIcon
          variant="subtle"
          style={{ color: theme.colors.textSecondary, flexShrink: 0 }}
        >
          <IconSearch size={20} />
        </ActionIcon>

        <ThemeToggle />
        <VoiceNavigation />
        <ProfileMenu isMobile={true} />
      </Group>
    </div>
  );
};

export default MobileNavbar;
