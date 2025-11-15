import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Title, Group, SegmentedControl } from "@mantine/core";
import { IconForms } from "@tabler/icons-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { CustomText, ActionButton } from "../../../components/ui";
import type { DashboardPeriod } from "../../../server-action/api/dashboard";
import { FRONTENDROUTES } from "../../../constants/frontendRoutes";

interface DashboardHeaderProps {
  period: DashboardPeriod;
  onPeriodChange: (period: DashboardPeriod) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  period,
  onPeriodChange,
}) => { 
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
          <SegmentedControl
            value={period}
            onChange={(value) => onPeriodChange(value as DashboardPeriod)}
            data={[
              { label: "Today", value: "today" },
              { label: "Week", value: "week" },
              { label: "Month", value: "month" },
              { label: "All", value: "all" },
            ]}
            style={{
              backgroundColor: theme.colors.surface,
            }}
          />
        
          <ActionButton
            onClick={() => navigate(FRONTENDROUTES.FOOD_ITEM)}
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
