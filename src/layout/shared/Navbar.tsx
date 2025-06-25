import React from "react";
import { Group, Title, ActionIcon, TextInput, Avatar } from "@mantine/core";
import { IconMenu2, IconSearch, IconBell, IconUser } from "@tabler/icons-react";

interface NavbarProps {
  onHamburgerClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHamburgerClick }) => {
  return (
    <div
      style={{
        height: "70px",
        backgroundColor: "#1A1B1E",
        borderBottom: "1px solid #333",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        justifyContent: "space-between",
      }}
    >
      <Group gap="xs">
        <ActionIcon variant="subtle" color="gray" onClick={onHamburgerClick}>
          <IconMenu2 size={24} />
        </ActionIcon>
        <Title order={3} style={{ color: "#FFFFFF", fontWeight: 600 }}>
          Food Ordering Admin
        </Title>
      </Group>

      <Group gap="xs">
        <TextInput
          placeholder="Search..."
          leftSection={<IconSearch size={18} />}
          style={{
            width: "250px",
            backgroundColor: "#2C2E33",
            color: "#A3A5A7",
          }}
          variant="filled"
        />
        <ActionIcon variant="subtle" color="gray">
          <IconBell size={20} />
        </ActionIcon>
        <Avatar src="https://via.placeholder.com/40" radius="xl" />
        <ActionIcon variant="subtle" color="gray">
          <IconUser size={20} />
        </ActionIcon>
      </Group>
    </div>
  );
};

export default Navbar;
