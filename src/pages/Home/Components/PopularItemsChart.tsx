import React, { useMemo } from "react";
import { Card, Title, Group, Text, Stack } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";

interface PopularItemsData {
  item: string;
  count: number;
  percentage: number;
}

interface PopularItemsChartProps {
  data: PopularItemsData[];
}

const PopularItemsChart: React.FC<PopularItemsChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const classes = useMemo(
    () => ({
      chartContainer: {
        height: "300px",
        position: "relative" as const,
      },
      pieChart: {
        width: "100%",
        height: "180px",
      },
    }),
    []
  );

  const renderPieChart = () => {
    const width = 300;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 20;
    const center = { x: width / 2, y: height / 2 };

    const total = data.reduce((sum, d) => sum + d.count, 0);
    let startAngle = 0;

    const colors = [
      theme.colors.primary,
      theme.colors.warning,
      theme.colors.success,
      theme.colors.secondary,
    ];

    return (
      <svg style={classes.pieChart} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${center.x},${center.y})`}>
          {data.map((d, i) => {
            const angle = (d.count / total) * 2 * Math.PI;
            const endAngle = startAngle + angle;
            const largeArc = angle > Math.PI ? 1 : 0;

            const x1 = radius * Math.cos(startAngle);
            const y1 = radius * Math.sin(startAngle);
            const x2 = radius * Math.cos(endAngle);
            const y2 = radius * Math.sin(endAngle);

            const path = `
              M 0 0
              L ${x1} ${y1}
              A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
              Z
            `;

            startAngle = endAngle;

            return (
              <path key={i} d={path} fill={colors[i % colors.length]} />
            );
          })}
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
        🍕 Popular Items
      </Title>
      <div style={classes.chartContainer}>
        <Group align="flex-start" gap="xl">
          <div style={{ flex: 1 }}>{renderPieChart()}</div>
          <Stack gap="xs" style={{ flex: 1 }}>
            {data.map((item, index) => (
              <Group key={index} justify="space-between">
                <Group gap="xs">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: [
                        theme.colors.primary,
                        theme.colors.warning,
                        theme.colors.success,
                        theme.colors.secondary,
                      ][index % 4],
                    }}
                  />
                  <Text size="sm" c={theme.colors.textSecondary}>
                    {item.item}
                  </Text>
                </Group>
                <Group gap="xs">
                  <Text size="sm" fw={600} c={theme.colors.textPrimary}>
                    {item.count}
                  </Text>
                  <Text size="xs" c={theme.colors.textSecondary}>
                    ({item.percentage}%)
                  </Text>
                </Group>
              </Group>
            ))}
          </Stack>
        </Group>
      </div>
    </Card>
  );
};

export default PopularItemsChart;
