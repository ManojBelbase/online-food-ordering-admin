import React from "react";
import { Card, Group, Badge } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";
import { CustomText } from "../../../components/ui";
interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
  change: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
}) => {
  const { theme } = useTheme();

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="sm"
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        height: "100%",
      }}
    >
      <Group justify="space-between">
        <div>
          <CustomText size="sm" color="secondary">
            {title}
          </CustomText>
          <CustomText size="xl" fontWeight={700} color="primary">
            {value}
          </CustomText>
        </div>
        <div
          style={{
            backgroundColor: `${color}20`,
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          <Icon size={24} style={{ color }} />
        </div>
      </Group>
      <Badge color="green" variant="light" size="sm">
        {change}
      </Badge>
    </Card>
  );
};

export default StatsCard;
