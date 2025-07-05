import React from "react";
import {
  Group,
  Title,
  ActionIcon,
  TextInput,
  Avatar,
} from "@mantine/core";
import {
  IconMenu2,
  IconSearch,
  IconBell,
  
} from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "../../components/ThemeToggle";

interface NavbarProps {
  onHamburgerClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHamburgerClick }) => {
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
      }}
    >
      <Group gap="xs">
        <ActionIcon
          variant="subtle"
          onClick={onHamburgerClick}
          style={{ color: theme.colors.textSecondary }}
        >
          <IconMenu2 size={24} />
        </ActionIcon>
        <Title
          order={3}
          style={{
            color: theme.colors.navbarText,
            fontWeight: 600,
          }}
        >
          Food Ordering Admin
        </Title>
      </Group>

      <Group gap="xs">
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
          style={{ width: "250px" }}
        />
        <ThemeToggle />
        <ActionIcon
          variant="subtle"
          style={{ color: theme.colors.textSecondary }}
        >
          <IconBell size={20} />
        </ActionIcon>
        <Avatar
          src="https://via.placeholder.com/40"
          radius="xl"
          style={{ cursor: "pointer" }}
        />
      </Group>
    </div>
  );
};

export default Navbar;
