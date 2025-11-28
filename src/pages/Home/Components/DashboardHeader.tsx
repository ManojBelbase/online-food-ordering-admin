import React from "react";
import { Card, Title, Group } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";
import { CustomText } from "../../../components/ui";
import { useAuth } from "../../../redux/useAuth";

interface DashboardHeaderProps {
  period?: string;
  onPeriodChange?: (period: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  const { theme } = useTheme();
  const { user } = useAuth();

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
            Food Ordering {user?.role} Dashboard
          </Title>
          <CustomText color="secondary">
            Monitor orders, revenue, and manage your food ordering system
          </CustomText>
        </div>

      </Group>
    </Card>
  );
};

export default DashboardHeader;
