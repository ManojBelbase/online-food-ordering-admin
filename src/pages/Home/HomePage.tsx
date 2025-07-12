import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Card,
  Title,
  Text,
  Group,
  Badge,
  Grid,
  Stack,
  Button,
} from "@mantine/core";
import {
  IconChartBar,
  IconUsers,
  IconShoppingCart,
  IconTrendingUp,
  IconComponents,
  IconForms,
} from "@tabler/icons-react";


const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

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
      title: "Analytics",
      value: "98.5%",
      icon: IconChartBar,
      color: theme.colors.secondary,
      change: "+2%",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>


      <Title
        order={1}
        style={{
          color: theme.colors.textPrimary,
          marginBottom: "30px",
        }}
      >
        Dashboard Overview
      </Title>

      {/* Quick Access Card */}
      <Card
        shadow="sm"
        padding="xl"
        radius="md"
        mb="xl"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          background: `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.secondary}10)`,
        }}
      >
        <Group justify="space-between" align="center">
          <div>
            <Title
              order={3}
              style={{ color: theme.colors.textPrimary, marginBottom: "8px" }}
            >
              🚀 Explore All Components & Forms
            </Title>
            <Text style={{ color: theme.colors.textSecondary }}>
              Access all available pages, forms, tables, and components in one
              place
            </Text>
          </div>
          <Group gap="md">
            <Button
              leftSection={<IconComponents size={16} />}
              onClick={() => navigate("/components")}
              style={{
                backgroundColor: theme.colors.primary,
                "&:hover": {
                  backgroundColor: theme.colors.primaryHover,
                },
              }}
            >
              View All Components
            </Button>
            <Button
              leftSection={<IconForms size={16} />}
              onClick={() => navigate("/orders/create")}
              variant="outline"
            >
              Create Order
            </Button>
          </Group>
        </Group>
      </Card>



      <Grid>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
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
                  <div>
                    <Text
                      size="sm"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {stat.title}
                    </Text>
                    <Text
                      size="xl"
                      fw={700}
                      style={{ color: theme.colors.textPrimary }}
                    >
                      {stat.value}
                    </Text>
                  </div>
                  <div
                    style={{
                      backgroundColor: `${stat.color}20`,
                      padding: "8px",
                      borderRadius: "8px",
                    }}
                  >
                    <Icon size={24} style={{ color: stat.color }} />
                  </div>
                </Group>
                <Badge color="green" variant="light" size="sm">
                  {stat.change}
                </Badge>
              </Card>
            </Grid.Col>
          );
        })}
      </Grid>

      <Grid mt="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
              height: "300px",
            }}
          >
            <Title
              order={3}
              mb="md"
              style={{ color: theme.colors.textPrimary }}
            >
              Recent Activity
            </Title>
            <Text style={{ color: theme.colors.textSecondary }}>
              Activity chart and recent orders will be displayed here.
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack>
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <Title
                order={4}
                mb="md"
                style={{ color: theme.colors.textPrimary }}
              >
                Quick Actions
              </Title>
              <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                • View all orders
              </Text>
              <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                • Manage menu items
              </Text>
              <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                • Customer support
              </Text>
            </Card>

            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              style={{
                backgroundColor: theme.colors.surface,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <Title
                order={4}
                mb="md"
                style={{ color: theme.colors.textPrimary }}
              >
                Theme System
              </Title>
              <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                The theme system is now active! Use the toggle in the navbar to
                switch between dark and light modes.
              </Text>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default HomePage;
