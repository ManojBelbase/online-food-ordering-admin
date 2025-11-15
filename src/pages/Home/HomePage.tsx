import React, { useState, useMemo } from "react";
import { Grid, Loader, Center, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconUsers,
  IconShoppingCart,
  IconTrendingUp,
  IconCake,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  StatsCard,
  OrderTrendsChart,
  PopularItemsChart,
  OrderStatusSummary,
  DashboardHeader,
  CategoryChart,
  PaymentMethodChart,
  HourlyDistributionChart,
  RecentOrdersTable,
} from "./Components";
import { useDashboardData } from "../../server-action/api/dashboard";
import type { DashboardPeriod } from "../../server-action/api/dashboard";
import { FRONTENDROUTES } from "../../constants/frontendRoutes";

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<DashboardPeriod>("all");
  const { data: dashboardData, isLoading, error } = useDashboardData(period);

  const stats = useMemo(() => {
    if (!dashboardData?.data) return [];
    const { overview, revenue, orders } = dashboardData.data;
    return [
      {
        title: "Total Orders",
        value: overview.totalOrders.toLocaleString(),
        icon: IconShoppingCart,
        color: theme.colors.primary,
        change: orders.growth.isPositive
          ? `+${orders.growth.percentage.toFixed(1)}%`
          : `${orders.growth.percentage.toFixed(1)}%`,
        onClick: () => navigate(FRONTENDROUTES.ORDERS),
      },
      {
        title: "Total Revenue",
        value: `$${overview.totalRevenue.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        icon: IconTrendingUp,
        color: theme.colors.warning,
        change: revenue.growth.isPositive
          ? `+${revenue.growth.percentage.toFixed(1)}%`
          : `${revenue.growth.percentage.toFixed(1)}%`,
      },
      {
        title: "Average Order Value",
        value: `$${overview.averageOrderValue.toFixed(2)}`,
        icon: IconUsers,
        color: theme.colors.success,
        change: `${overview.totalFoodItems} items`,
      },
      {
        title: "Food Items",
        value: overview.totalFoodItems.toString(),
        icon: IconCake,
        color: theme.colors.secondary,
        change: `${overview.totalCategories} categories`,
        onClick: () => navigate(FRONTENDROUTES.FOOD_ITEM),
      },
    ];
  }, [dashboardData, theme, navigate]);

  const orderStatusSummary = useMemo(() => {
    if (!dashboardData?.data?.orders?.byStatus) return [];
    const { byStatus } = dashboardData.data.orders;
    return [
      { status: "Pending", count: byStatus.pending || 0, color: theme.colors.warning },
      { status: "Accepted", count: byStatus.accepted || 0, color: theme.colors.primary },
      { status: "Preparing", count: byStatus.preparing || 0, color: theme.colors.primary },
      { status: "Ready", count: byStatus.ready || 0, color: theme.colors.success },
      { status: "Completed", count: byStatus.completed || 0, color: theme.colors.success },
      { status: "Cancelled", count: byStatus.cancelled || 0, color: theme.colors.error },
    ];
  }, [dashboardData, theme]);

  const orderTrendsData = useMemo(() => {
    if (!dashboardData?.data?.trends?.dailyRevenue) return [];
    return dashboardData.data.trends.dailyRevenue.map((item) => ({
      date: item.date,
      revenue: item.revenue,
      orderCount: item.orderCount,
    }));
  }, [dashboardData]);

  const popularItemsData = useMemo(() => {
    if (!dashboardData?.data?.topSellingItems) return [];
    const items = dashboardData.data.topSellingItems;
    const total = items.reduce((sum, item) => sum + item.totalQuantity, 0);
    return items.map((item) => ({
      item: item.name,
      count: item.totalQuantity,
      percentage: total > 0 ? Math.round((item.totalQuantity / total) * 100) : 0,
    }));
  }, [dashboardData]);

  const categoryData = useMemo(() => {
    if (!dashboardData?.data?.categoryPerformance) return [];
    const categories = dashboardData.data.categoryPerformance;
    const total = categories.reduce((sum, cat) => sum + cat.totalQuantity, 0);
    return categories.map((cat) => ({
      category: cat.categoryName,
      count: cat.totalQuantity,
      percentage: total > 0 ? Math.round((cat.totalQuantity / total) * 100) : 0,
    }));
  }, [dashboardData]);

  const paymentData = useMemo(() => {
    if (!dashboardData?.data?.paymentMethods) return [];
    const methods = dashboardData.data.paymentMethods;
    const total = methods.reduce((sum, m) => sum + m.revenue, 0);
    const icons = [IconShoppingCart, IconUsers, IconTrendingUp];
    const colors = ["#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#f44336"];
    return methods.map((method, index) => ({
      method: method.method,
      amount: method.revenue,
      percentage: total > 0 ? Math.round((method.revenue / total) * 100) : 0,
      icon: icons[index % icons.length],
      color: colors[index % colors.length],
    }));
  }, [dashboardData]);

  const hourlyData = useMemo(() => {
    if (!dashboardData?.data?.trends?.hourlyDistribution) return [];
    return dashboardData.data.trends.hourlyDistribution;
  }, [dashboardData]);

  const recentOrders = useMemo(() => {
    if (!dashboardData?.data?.recentOrders) return [];
    return dashboardData.data.recentOrders;
  }, [dashboardData]);

  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <div className="overflow-scroll">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          mb="md"
        >
          Failed to load dashboard data. Please try again later.
        </Alert>
      </div>
    );
  }

  return (
    <div className="overflow-scroll">
      <DashboardHeader period={period} onPeriodChange={setPeriod} />

      <Grid>
        {stats.map((stat, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
            <StatsCard {...stat} />
          </Grid.Col>
        ))}
      </Grid>

      <Grid>
       
        <Grid.Col span={{ base: 12, md: 6 }}>
          <PopularItemsChart data={popularItemsData} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <CategoryChart data={categoryData} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <PaymentMethodChart data={paymentData} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <HourlyDistributionChart data={hourlyData} />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={12}>
          <OrderStatusSummary data={orderStatusSummary} />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={12}>
          <RecentOrdersTable data={recentOrders} />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default HomePage;
