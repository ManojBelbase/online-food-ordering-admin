import React, { useMemo } from "react";
import { Card, Title } from "@mantine/core";
import { useTheme } from "../../../contexts/ThemeContext";

interface OrderTrendsData {
  date: string;
  revenue?: number;
  orderCount?: number;
  orders?: number; // For backward compatibility
}

interface OrderTrendsChartProps {
  data: OrderTrendsData[];
  showRevenue?: boolean;
}

const OrderTrendsChart: React.FC<OrderTrendsChartProps> = ({
  data,
  showRevenue = false,
}) => {
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

    const getValue = (d: OrderTrendsData) => {
      if (showRevenue) {
        return d.revenue || 0;
      }
      return d.orderCount || d.orders || 0;
    };

    const yMax = Math.max(...data.map(getValue), 1) * 1.1;

    const linePath = data
      .map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * innerWidth;
        const y = innerHeight - (getValue(d) / yMax) * innerHeight;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

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
            const x = (i / (data.length - 1 || 1)) * innerWidth;
            const y = innerHeight - (getValue(d) / yMax) * innerHeight;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={4} fill={theme.colors.primary} />
                <text
                  x={x}
                  y={innerHeight + 20}
                  textAnchor="middle"
                  fontSize="9"
                  fill={theme.colors.textSecondary}
                >
                  {formatDate(d.date)}
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
      padding="lg"
      radius="sm"
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
        height: "100%",
      }}
    >
      <Title order={3} mb="md" style={{ color: theme.colors.textPrimary }}>
        {showRevenue ? "Revenue Trends" : "Order Trends"}
      </Title>
      <div style={classes.chartContainer}>{renderLineChart()}</div>
    </Card>
  );
};

export default OrderTrendsChart;
