import React, { useMemo } from "react";
import { Grid, Loader, Center, Alert } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  IconUsers,
  IconShoppingCart,
  IconTrendingUp,
  IconCake,
  IconAlertCircle,
  IconBuildingStore,
  IconCategory,
} from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  StatsCard,
  PopularItemsChart,
  OrderStatusSummary,
  // DashboardHeader,
  CategoryChart,
  PaymentMethodChart,
  HourlyDistributionChart,
  RecentOrdersTable,
  RecentUsersTable,
} from "./Components";
import { useDashboardData } from "../../server-action/api/dashboard";
import { FRONTENDROUTES } from "../../constants/frontendRoutes";
import { useAuth } from "../../redux/useAuth";
import { Roles } from "../../constants/roles";
import { restaurantApi } from "../../server-action/api/restaurant";
import { userApi } from "../../server-action/api/user";
import { globalCategoryApi } from "../../server-action/api/global-category";

const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === Roles.ADMIN;
  const { data: dashboardData, isLoading, error } = useDashboardData("all", !isAdmin);

  // Admin data
  const { data: restaurantsData } = restaurantApi.useGetAll(undefined, { enabled: isAdmin });
  const { data: customersData } = userApi.useGetAll(undefined, { enabled: isAdmin });
  const { data: globalCategoriesData } = globalCategoryApi.useGetAll(undefined, { enabled: isAdmin });

  const stats = useMemo(() => {
    // Admin dashboard stats
    if (isAdmin) {
      const restaurantCount = (restaurantsData as any)?.restaurant?.length || 0;
      const customerCount = (customersData as any)?.user?.length || 0;
      const categoryCount = (globalCategoriesData as any)?.globalCategory?.length || 0;

      return [
        {
          title: "Total Restaurants",
          value: restaurantCount.toLocaleString(),
          icon: IconBuildingStore,
          color: theme.colors.primary,
          change: "Active",
          onClick: () => navigate(FRONTENDROUTES.RESTAURANT),
        },
        {
          title: "Total Customers",
          value: customerCount.toLocaleString(),
          icon: IconUsers,
          color: theme.colors.success,
          change: "Registered",
          onClick: () => navigate(FRONTENDROUTES.CUSTOMER),
        },
        {
          title: "Global Categories",
          value: categoryCount.toLocaleString(),
          icon: IconCategory,
          color: theme.colors.warning,
          change: "Categories",
          onClick: () => navigate(FRONTENDROUTES.GLOBAL_CATEGORY),
        },

      ];
    }

    // Restaurant dashboard stats
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
        value: `Rs.${overview.totalRevenue.toLocaleString(undefined, {
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
        value: `Rs.${overview.averageOrderValue.toFixed(2)}`,
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
  }, [dashboardData, theme, navigate, isAdmin, restaurantsData, customersData, globalCategoriesData]);

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

  const recentUsers = useMemo(() => {
    if (!customersData || !isAdmin) return [];
    let users: any[] = [];
    if (Array.isArray(customersData)) {
      users = customersData;
    } else if ((customersData as any)?.user && Array.isArray((customersData as any).user)) {
      users = (customersData as any).user;
    } else if ((customersData as any)?.users && Array.isArray((customersData as any).users)) {
      users = (customersData as any).users;
    } else if ((customersData as any)?.data && Array.isArray((customersData as any).data)) {
      users = (customersData as any).data;
    }

    const sortedUsers = users
      .filter((u: any) => u && u._id)
      .sort((a: any, b: any) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
    return sortedUsers.slice(0, 5);
  }, [customersData, isAdmin]);

  const showLoading = isAdmin ? false : isLoading;

  if (showLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error && !isAdmin) {
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
      {/* <DashboardHeader /> */}

      <Grid>
        {stats.map((stat, index) => (
          <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
            <StatsCard {...stat} />
          </Grid.Col>
        ))}
      </Grid>

      {isAdmin && (
        <Grid>
          <Grid.Col span={12}>
            <RecentUsersTable data={recentUsers} />
          </Grid.Col>
        </Grid>
      )}

      {!isAdmin && (
        <>
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
        </>
      )}
    </div>
  );
};

export default HomePage;
