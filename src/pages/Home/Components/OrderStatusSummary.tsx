import React from "react";
import { Card, Title, Grid, Group, Badge } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";
import { CustomText } from "../../../components/ui";

interface OrderStatusData {
  status: string;
  count: number;
  color: string;
}

interface OrderStatusSummaryProps {
  data: OrderStatusData[];
}

const OrderStatusSummary: React.FC<OrderStatusSummaryProps> = ({ data }) => {
  const { theme } = useTheme();

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="sm"
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        height: "100%",
      }}
    >
      <Title order={3} mb="md" style={{ color: theme.colors.textPrimary }}>
        Order Status Summary
      </Title>
      <Grid>
        {data.map((item, index) => (
          <Grid.Col key={index} span={3}>
            <Group justify="space-between">
              <CustomText color="secondary">{item.status}</CustomText>
              <Badge color={item.color} variant="light">
                {item.count}
              </Badge>
            </Group>
          </Grid.Col>
        ))}
      </Grid>
    </Card>
  );
};

export default OrderStatusSummary;
