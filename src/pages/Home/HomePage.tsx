import React from "react";
import { Grid } from "@mantine/core";
import {
  IconUsers,
  IconShoppingCart,
  IconTrendingUp,
  IconCake,
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
} from "./Components";

const orderTrendsData = [
  { date: "Aug 9", orders: 120 },
  { date: "Aug 10", orders: 150 },
  { date: "Aug 11", orders: 130 },
  { date: "Aug 12", orders: 180 },
  { date: "Aug 13", orders: 200 },
  { date: "Aug 14", orders: 160 },
  { date: "Aug 15", orders: 220 },
];

const popularItemsData = [
  { item: "Pizza", count: 300, percentage: 37 },
  { item: "Burger", count: 250, percentage: 31 },
  { item: "Sushi", count: 150, percentage: 19 },
  { item: "Pasta", count: 100, percentage: 13 },
];

const categoryData = [
  { category: "Beverages", count: 200, percentage: 40 },
  { category: "Snacks", count: 150, percentage: 30 },
  { category: "Meals", count: 100, percentage: 20 },
  { category: "Desserts", count: 50, percentage: 10 },
];

const paymentData = [
  {
    method: "Credit Card",
    amount: 25000,
    percentage: 50,
    icon: IconShoppingCart,
    color: "#4caf50",
  },
  {
    method: "PayPal",
    amount: 15000,
    percentage: 30,
    icon: IconUsers,
    color: "#2196f3",
  },
  {
    method: "Cash",
    amount: 10000,
    percentage: 20,
    icon: IconTrendingUp,
    color: "#ff9800",
  },
];

const HomePage: React.FC = () => {
  const { theme } = useTheme();

  const stats = [
    {
      title: "Total Orders",
      value: "1,234",
      icon: IconShoppingCart,
      color: theme.colors.primary,
      change: "+12%",
    },
    {
      title: "Active Users",
      value: "856",
      icon: IconUsers,
      color: theme.colors.success,
      change: "+8%",
    },
    {
      title: "Revenue",
      value: "$45,678",
      icon: IconTrendingUp,
      color: theme.colors.warning,
      change: "+15%",
    },
    {
      title: "Popular Items",
      value: "4",
      icon: IconCake,
      color: theme.colors.secondary,
      change: "+5%",
    },
  ];

  const orderStatusSummary = [
    { status: "Pending", count: 150, color: theme.colors.warning },
    { status: "Preparing", count: 200, color: theme.colors.primary },
    { status: "Ready", count: 50, color: theme.colors.success },
    { status: "Completed", count: 834, color: theme.colors.success },
  ];

  return (
    <div className="overflow-scroll">
      <DashboardHeader />

      <Grid>
        {stats.map((stat, index) => (
          <Grid.Col key={index}  span={{ base: 12, sm: 6, lg: 3 }}>
            <StatsCard {...stat} />
          </Grid.Col>
        ))}
      </Grid>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <OrderTrendsChart data={orderTrendsData} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <PopularItemsChart data={popularItemsData} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <CategoryChart data={categoryData} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <PaymentMethodChart data={paymentData} />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={12}>
          <OrderStatusSummary data={orderStatusSummary} />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default HomePage;
