import React, { useMemo } from "react";
import { Card, Title, Group, Text, Stack, Progress } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";

interface PaymentMethodData {
  method: string;
  amount: number;
  percentage: number;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  color: string;
}

interface PaymentMethodChartProps {
  data: PaymentMethodData[];
}

const PaymentMethodChart: React.FC<PaymentMethodChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const classes = useMemo(
    () => ({
      chartContainer: {
        height: "300px",
        position: "relative" as const,
      },
      donutChart: {
        width: "100%",
        height: "180px",
      },
    }),
    []
  );

  const renderDonutChart = () => {
    const width = 180;
    const height = 180;
    const radius = 70;
    const innerRadius = 45;
    const center = { x: width / 2, y: height / 2 };

    const total = data.reduce((sum, d) => sum + d.amount, 0);
    let startAngle = 0;

    return (
      <svg style={classes.donutChart} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${center.x},${center.y})`}>
          {data.map((d, i) => {
            const angle = (d.amount / total) * 2 * Math.PI;
            const endAngle = startAngle + angle;
            const largeArc = angle > Math.PI ? 1 : 0;

            const x1 = radius * Math.cos(startAngle);
            const y1 = radius * Math.sin(startAngle);
            const x2 = radius * Math.cos(endAngle);
            const y2 = radius * Math.sin(endAngle);

            const innerX1 = innerRadius * Math.cos(startAngle);
            const innerY1 = innerRadius * Math.sin(startAngle);
            const innerX2 = innerRadius * Math.cos(endAngle);
            const innerY2 = innerRadius * Math.sin(endAngle);

            const path = `
              M ${innerX1} ${innerY1}
              L ${x1} ${y1}
              A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
              L ${innerX2} ${innerY2}
              A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerX1} ${innerY1}
              Z
            `;

            startAngle = endAngle;

            return <path key={i} d={path} fill={d.color} />;
          })}
          {/* Center text */}
          <text
            textAnchor="middle"
            dy="0.35em"
            fontSize="12"
            fontWeight="bold"
            fill={theme.colors.textPrimary}
          >
            Payment
          </text>
          <text
            textAnchor="middle"
            dy="1.5em"
            fontSize="10"
            fill={theme.colors.textSecondary}
          >
            Methods
          </text>
        </g>
      </svg>
    );
  };

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
        💳 Payment Methods
      </Title>
      <div style={classes.chartContainer}>
        <Group align="flex-start" gap="xl">
          <div style={{ flex: 1 }}>{renderDonutChart()}</div>
          <Stack gap="md" style={{ flex: 1 }}>
            {data.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index}>
                  <Group justify="space-between" mb="xs">
                    <Group gap="xs">
                      <div
                        style={{
                          backgroundColor: `${item.color}20`,
                          padding: "6px",
                          borderRadius: "6px",
                        }}
                      >
                        <Icon size={16} style={{ color: item.color }} />
                      </div>
                      <Text size="sm" c={theme.colors.textSecondary}>
                        {item.method}
                      </Text>
                    </Group>
                    <Group gap="xs">
                      <Text size="sm" fw={600} c={theme.colors.textPrimary}>
                        Rs.{item.amount.toLocaleString()}
                      </Text>
                      <Text size="xs" c={theme.colors.textSecondary}>
                        ({item.percentage}%)
                      </Text>
                    </Group>
                  </Group>
                  <Progress
                    value={item.percentage}
                    color={item.color}
                    size="xs"
                    radius="xl"
                  />
                </div>
              );
            })}
          </Stack>
        </Group>
      </div>
    </Card>
  );
};

export default PaymentMethodChart;
