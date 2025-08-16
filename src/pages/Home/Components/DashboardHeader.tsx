import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Title, Group } from "@mantine/core";
import { IconComponents, IconForms } from "@tabler/icons-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { CustomText, ActionButton } from "../../../components/ui";

const DashboardHeader: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <Card
      shadow="sm"
      padding="xl"
      radius="sm"
      mb="xs"
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        background: `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.secondary}10)`,
      }}
    >
      <Group justify="space-between" align="center">
        <div>
          <Title
            order={3}
            style={{ color: theme.colors.textPrimary, marginBottom: "8px" }}
          >
            🚀 Food Ordering Dashboard
          </Title>
          <CustomText color="secondary">
            Monitor orders, revenue, and manage your food ordering system
          </CustomText>
        </div>
        <Group gap="md">
          <ActionButton
            onClick={() => navigate("/components")}
            variant="primary"
          >
            <IconComponents size={16} style={{ marginRight: "8px" }} />
            View All Components
          </ActionButton>
          <ActionButton
            onClick={() => navigate("/menu-management")}
            variant="secondary"
          >
            <IconForms size={16} style={{ marginRight: "8px" }} />
            Manage Menu
          </ActionButton>
        </Group>
      </Group>
    </Card>
  );
};

export default DashboardHeader;
