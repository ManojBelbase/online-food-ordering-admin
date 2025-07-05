import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import {
  IconShoppingCart,
  IconChefHat,
  IconUsers,
  IconTruck,
  IconCreditCard,
  IconReportAnalytics,
  IconPlus,
  IconEye,
  IconTable,
  IconForms,
} from "@tabler/icons-react";
import PageHeader from "../../components/GlobalComponents/PageHeader";
import { useTheme } from "../../contexts/ThemeContext";

const ComponentsIndex: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const sections = [
    {
      title: "Orders Management",
      description:
        "Manage customer orders, view order details, and track order status",
      icon: IconShoppingCart,
      color: theme.colors.primary,
      routes: [
        { label: "All Orders (Table)", path: "/orders", type: "table" },
        { label: "Create Order (Form)", path: "/orders/create", type: "form" },
        { label: "Pending Orders", path: "/orders/pending", type: "page" },
        {
          label: "Processing Orders",
          path: "/orders/processing",
          type: "page",
        },
        { label: "Completed Orders", path: "/orders/completed", type: "page" },
      ],
    },
    {
      title: "Menu Management",
      description: "Manage restaurant menu items, categories, and inventory",
      icon: IconChefHat,
      color: theme.colors.secondary,
      routes: [
        { label: "Menu Categories", path: "/menu/categories", type: "page" },
        { label: "Food Items", path: "/menu/items", type: "table" },
        { label: "Add Menu Item (Form)", path: "/menu/add-item", type: "form" },
        { label: "Inventory", path: "/menu/inventory", type: "page" },
      ],
    },
    {
      title: "Customer Management",
      description: "Manage customer information, reviews, and loyalty programs",
      icon: IconUsers,
      color: theme.colors.success,
      routes: [
        { label: "All Customers", path: "/customers", type: "table" },
        { label: "Customer Reviews", path: "/customers/reviews", type: "page" },
        { label: "Loyalty Program", path: "/customers/loyalty", type: "page" },
      ],
    },
    {
      title: "Delivery Management",
      description: "Manage delivery areas, staff, and tracking",
      icon: IconTruck,
      color: theme.colors.warning,
      routes: [
        { label: "Delivery Areas", path: "/delivery/areas", type: "page" },
        { label: "Delivery Staff", path: "/delivery/staff", type: "table" },
        {
          label: "Delivery Tracking",
          path: "/delivery/tracking",
          type: "page",
        },
      ],
    },
    {
      title: "Payment Management",
      description: "Handle transactions, payment methods, and refunds",
      icon: IconCreditCard,
      color: theme.colors.error,
      routes: [
        {
          label: "Transactions",
          path: "/payments/transactions",
          type: "table",
        },
        { label: "Payment Methods", path: "/payments/methods", type: "page" },
        { label: "Refunds", path: "/payments/refunds", type: "page" },
      ],
    },
    {
      title: "Analytics & Reports",
      description:
        "View sales reports, customer analytics, and performance metrics",
      icon: IconReportAnalytics,
      color: theme.colors.primary,
      routes: [
        { label: "Sales Report", path: "/analytics/sales", type: "page" },
        {
          label: "Customer Analytics",
          path: "/analytics/customers",
          type: "page",
        },
        { label: "Menu Performance", path: "/analytics/menu", type: "page" },
        { label: "Revenue Trends", path: "/analytics/revenue", type: "page" },
      ],
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "form":
        return <IconForms size={14} />;
      case "table":
        return <IconTable size={14} />;
      default:
        return <IconEye size={14} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "form":
        return "green";
      case "table":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <PageHeader
        title="Components & Forms Index"
        subtitle="Navigate to all available pages, forms, and tables in the system"
        actions={[
          {
            label: "Create Order",
            onClick: () => navigate("/orders/create"),
            icon: <IconPlus size={16} />,
            variant: "filled",
          },
          {
            label: "View Orders",
            onClick: () => navigate("/orders"),
            icon: <IconTable size={16} />,
            variant: "outline",
          },
        ]}
      />

      <Grid>
        {sections.map((section, index) => (
          <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
                height: "100%",
              }}
            >
              <Group justify="space-between" mb="xs">
                <ThemeIcon
                  size="lg"
                  radius="md"
                  style={{ backgroundColor: `${section.color}20` }}
                >
                  <section.icon size={24} style={{ color: section.color }} />
                </ThemeIcon>
              </Group>

              <Title
                order={4}
                mb="xs"
                style={{ color: theme.colors.textPrimary }}
              >
                {section.title}
              </Title>

              <Text
                size="sm"
                style={{
                  color: theme.colors.textSecondary,
                  marginBottom: "16px",
                  lineHeight: 1.4,
                }}
              >
                {section.description}
              </Text>

              <Stack gap="xs">
                {section.routes.map((route, routeIndex) => (
                  <Group key={routeIndex} justify="space-between">
                    <Group gap="xs">
                      <Badge
                        size="xs"
                        color={getTypeColor(route.type)}
                        leftSection={getTypeIcon(route.type)}
                      >
                        {route.type}
                      </Badge>
                      <Text
                        size="sm"
                        style={{ color: theme.colors.textPrimary }}
                      >
                        {route.label}
                      </Text>
                    </Group>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={() => navigate(route.path)}
                    >
                      Open
                    </Button>
                  </Group>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Card
        mt="xl"
        shadow="sm"
        padding="lg"
        radius="md"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <Title order={3} mb="md" style={{ color: theme.colors.textPrimary }}>
          Quick Access to Forms
        </Title>
        <Group gap="md">
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate("/orders/create")}
            style={{ backgroundColor: theme.colors.primary }}
          >
            Create New Order
          </Button>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => navigate("/menu/add-item")}
            variant="outline"
          >
            Add Menu Item
          </Button>
          <Button
            leftSection={<IconTable size={16} />}
            onClick={() => navigate("/orders")}
            variant="outline"
          >
            View Orders Table
          </Button>
        </Group>
      </Card>
    </div>
  );
};

export default ComponentsIndex;
