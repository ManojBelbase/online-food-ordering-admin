import React, { useMemo } from "react";
import { Card, Title } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";

interface HourlyData {
  hour: number;
  orderCount: number;
  revenue: number;
}

interface HourlyDistributionChartProps {
  data: HourlyData[];
}

const HourlyDistributionChart: React.FC<HourlyDistributionChartProps> = ({
  data,
}) => {
  const { theme } = useTheme();

  const classes = useMemo(
    () => ({
      chartContainer: {
        height: "300px",
        position: "relative" as const,
      },
      barChart: {
        width: "100%",
        height: "250px",
      },
    }),
    []
  );

  const renderBarChart = () => {
    const width = 600;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const maxCount = Math.max(...data.map((d) => d.orderCount), 1);
    const barWidth = innerWidth / 24 - 2;

    return (
      <svg style={classes.barChart} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {Array.from({ length: 24 }, (_, hour) => {
            const hourData = data.find((d) => d.hour === hour);
            const orderCount = hourData?.orderCount || 0;
            const barHeight = (orderCount / maxCount) * innerHeight;
            const x = hour * (barWidth + 2);
            const y = innerHeight - barHeight;

            return (
              <g key={hour}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={
                    orderCount > 0
                      ? theme.colors.primary
                      : theme.colors.border + "40"
                  }
                  rx={2}
                />
                {hour % 4 === 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={innerHeight + 15}
                    textAnchor="middle"
                    fontSize="9"
                    fill={theme.colors.textSecondary}
                  >
                    {hour}:00
                  </text>
                )}
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
      padding="lg"
      radius="sm"
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        height: "100%",
      }}
    >
      <Title order={3} mb="md" style={{ color: theme.colors.textPrimary }}>
        📈 Hourly Order Distribution
      </Title>
      <div style={classes.chartContainer}>{renderBarChart()}</div>
    </Card>
  );
};

export default HourlyDistributionChart;

