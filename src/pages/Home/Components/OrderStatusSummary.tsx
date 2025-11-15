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
          <Grid.Col key={index} span={{ base: 6, sm: 4, md: 2 }}>
            <div
              style={{
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: `${item.color}10`,
                border: `1px solid ${item.color}30`,
                textAlign: "center",
              }}
            >
              <CustomText
                size="xs"
                color="secondary"
                style={{ marginBottom: "8px", textTransform: "uppercase" }}
              >
                {item.status}
              </CustomText>
              <Badge
                color={item.color}
                variant="filled"
                size="lg"
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  padding: "8px 16px",
                  minWidth: "60px",
                }}
              >
                {item.count}
              </Badge>
            </div>
          </Grid.Col>
        ))}
      </Grid>
    </Card>
  );
};

export default OrderStatusSummary;
