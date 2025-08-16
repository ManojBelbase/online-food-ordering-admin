import React, { useMemo } from "react";
import { Card, Title, Group, Text, Stack } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const classes = useMemo(
    () => ({
      chartContainer: {
        height: "300px",
        position: "relative" as const,
      },
      barChart: {
        width: "100%",
        height: "200px",
      },
    }),
    []
  );

  const renderBarChart = () => {
    const width = 400;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const maxCount = Math.max(...data.map((d) => d.count));
    const barWidth = innerWidth / data.length - 10;

    const colors = [
      theme.colors.primary,
      theme.colors.success,
      theme.colors.warning,
      theme.colors.secondary,
      "#8884d8",
      "#82ca9d",
    ];

    return (
      <svg style={classes.barChart} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {data.map((d, i) => {
            const barHeight = (d.count / maxCount) * innerHeight;
            const x = i * (barWidth + 10);
            const y = innerHeight - barHeight;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={colors[i % colors.length]}
                  rx={4}
                />
                <text
                  x={x + barWidth / 2}
                  y={innerHeight + 15}
                  textAnchor="middle"
                  fontSize="10"
                  fill={theme.colors.textSecondary}
                >
                  {d.category}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill={theme.colors.textPrimary}
                >
                  {d.count}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    );
  };

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="sm"
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        height: "100%",
        overflowY:"scroll"
      }}
    >
      <Title order={3} mb="sm" style={{ color: theme.colors.textPrimary }}>
        📊 Top Categories
      </Title>
      <div style={classes.chartContainer}>
        {renderBarChart()}
        <Stack gap="xs" mt="xs">
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
                      theme.colors.success,
                      theme.colors.warning,
                      theme.colors.secondary,
                      "#8884d8",
                      "#82ca9d",
                    ][index % 6],
                  }}
                />
                <Text size="sm" c={theme.colors.textSecondary}>
                  {item.category}
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
      </div>
    </Card>
  );
};

export default CategoryChart;
