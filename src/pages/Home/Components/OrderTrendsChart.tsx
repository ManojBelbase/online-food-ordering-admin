import React, { useMemo } from "react";
import { Card, Title } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";

interface OrderTrendsData {
  date: string;
  orders: number;
}

interface OrderTrendsChartProps {
  data: OrderTrendsData[];
}

const OrderTrendsChart: React.FC<OrderTrendsChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const classes = useMemo(
    () => ({
      chartContainer: {
        height: "250px",
        position: "relative" as const,
      },
      lineChart: {
        width: "100%",
        height: "100%",
      },
    }),
    []
  );

  const renderLineChart = () => {
    const width = 400;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const yMax = Math.max(...data.map((d) => d.orders)) * 1.1;

    const linePath = data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * innerWidth;
        const y = innerHeight - (d.orders / yMax) * innerHeight;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    return (
      <svg style={classes.lineChart} viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <path
            d={linePath}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth={2}
          />
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * innerWidth;
            const y = innerHeight - (d.orders / yMax) * innerHeight;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={4}
                fill={theme.colors.primary}
              />
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
        Order Trends (Last 7 Days)
      </Title>
      <div style={classes.chartContainer}>{renderLineChart()}</div>
    </Card>
  );
};

export default OrderTrendsChart;
