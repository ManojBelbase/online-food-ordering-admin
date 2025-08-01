import React from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeToggle: React.FC = () => {
  const { themeName, toggleTheme } = useTheme();

  return (
    <Tooltip
      label={`Switch to ${themeName === "dark" ? "light" : "dark"} theme`}
      position="bottom"
      zIndex={10000}
    >
      <ActionIcon
        variant="subtle"
        size="lg"
        onClick={toggleTheme}
        style={{
          transition: "all 0.2s ease",
        }}
      >
        {themeName === "dark" ? (
          <IconSun size={20} style={{ color: "#fbbf24" }} />
        ) : (
          <IconMoon size={20} style={{ color: "#6366f1" }} />
        )}
      </ActionIcon>
    </Tooltip>
  );
};

export default ThemeToggle;
