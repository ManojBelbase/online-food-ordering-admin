import React, { useState } from "react";
import {
  Container,
  Card,
  Text,
  Group,
  Badge,
  ActionIcon,
  Stack,
  Tabs,
  Avatar,
  Select,
  Switch,
} from "@mantine/core";
import {
  IconBell,
  IconCheck,
  IconTrash,
  IconFilter,
  IconRefresh,
} from "@tabler/icons-react";
import { useTheme } from "../contexts/ThemeContext";
import PageHeader from "../components/GlobalComponents/PageHeader";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "order" | "payment" | "system" | "user" | "promotion";
  priority: "low" | "medium" | "high";
  avatar?: string;
}

const NotificationsPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("all");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [autoMarkRead, setAutoMarkRead] = useState(true);

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Order Received",
      message: "Order #1234 from John Doe - $45.99",
      time: "2 minutes ago",
      read: false,
      type: "order",
      priority: "high",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 2,
      title: "Payment Confirmed",
      message: "Payment for Order #1233 has been confirmed",
      time: "5 minutes ago",
      read: false,
      type: "payment",
      priority: "medium",
    },
    {
      id: 3,
      title: "System Maintenance",
      message: "Scheduled maintenance completed successfully",
      time: "1 hour ago",
      read: true,
      type: "system",
      priority: "low",
    },
    {
      id: 4,
      title: "New User Registration",
      message: "Jane Smith has created a new account",
      time: "2 hours ago",
      read: false,
      type: "user",
      priority: "low",
      avatar: "https://via.placeholder.com/40",
    },
    {
      id: 5,
      title: "Promotion Started",
      message: "Weekend Special promotion is now active",
      time: "3 hours ago",
      read: true,
      type: "promotion",
      priority: "medium",
    },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order": return "blue";
      case "payment": return "green";
      case "system": return "gray";
      case "user": return "purple";
      case "promotion": return "orange";
      default: return "gray";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "red";
      case "medium": return "yellow";
      case "low": return "gray";
      default: return "gray";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (activeTab === "unread" && notif.read) return false;
    if (filterType && notif.type !== filterType) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <Card
      shadow="sm"
      padding="md"
      style={{
        backgroundColor: notification.read 
          ? theme.colors.surface 
          : `${theme.colors.primary}05`,
        border: `1px solid ${notification.read ? theme.colors.border : theme.colors.primary}20`,
        marginBottom: "8px",
      }}
    >
      <Group justify="space-between" align="flex-start">
        <Group align="flex-start" gap="md" style={{ flex: 1 }}>
          {notification.avatar && (
            <Avatar src={notification.avatar} size={40} radius="xl" />
          )}
          <div style={{ flex: 1 }}>
            <Group justify="space-between" mb="xs">
              <Group gap="xs">
                <Text fw={600} size="sm" style={{ color: theme.colors.textPrimary }}>
                  {notification.title}
                </Text>
                <Badge
                  variant="light"
                  color={getTypeColor(notification.type)}
                  size="xs"
                >
                  {notification.type}
                </Badge>
                <Badge
                  variant="dot"
                  color={getPriorityColor(notification.priority)}
                  size="xs"
                >
                  {notification.priority}
                </Badge>
              </Group>
              <Text size="xs" style={{ color: theme.colors.textTertiary }}>
                {notification.time}
              </Text>
            </Group>
            <Text size="sm" style={{ color: theme.colors.textSecondary }}>
              {notification.message}
            </Text>
          </div>
        </Group>
        
        <Group gap="xs">
          {!notification.read && (
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => markAsRead(notification.id)}
              title="Mark as read"
            >
              <IconCheck size={16} />
            </ActionIcon>
          )}
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => deleteNotification(notification.id)}
            title="Delete notification"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );

  return (
    <Container size="lg" py="md">
      <PageHeader
        title="Notifications"
        breadcrumbs={[
          { label: "Dashboard", href: "/" },
          { label: "Notifications", href: "/notifications" },
        ]}
        actions={[
          {
            label: "Mark All Read",
            onClick: markAllAsRead,
            variant: "outline" as const,
            color: "blue",
          },
          {
            label: "Refresh",
            onClick: () => window.location.reload(),
            icon: <IconRefresh size={16} />,
            variant: "filled" as const,
          },
        ]}
      />

      <Card
        shadow="sm"
        padding="lg"
        mt="md"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <Group justify="space-between" mb="md">
          <Group gap="md">
            <Select
              placeholder="Filter by type"
              value={filterType}
              onChange={setFilterType}
              data={[
                { value: "order", label: "Orders" },
                { value: "payment", label: "Payments" },
                { value: "system", label: "System" },
                { value: "user", label: "Users" },
                { value: "promotion", label: "Promotions" },
              ]}
              clearable
              leftSection={<IconFilter size={16} />}
              style={{ width: 200 }}
            />
          </Group>
          
          <Group gap="md">
            <Switch
              label="Auto-mark as read"
              checked={autoMarkRead}
              onChange={(e) => setAutoMarkRead(e.currentTarget.checked)}
            />
            <Badge variant="light" size="lg">
              {unreadCount} unread
            </Badge>
          </Group>
        </Group>

        <Tabs value={activeTab} onChange={(value) => setActiveTab(value || "all")}>
          <Tabs.List>
            <Tabs.Tab value="all" leftSection={<IconBell size={16} />}>
              All ({notifications.length})
            </Tabs.Tab>
            <Tabs.Tab value="unread" leftSection={<IconBell size={16} />}>
              Unread ({unreadCount})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="all" pt="md">
            <Stack gap="xs">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))
              ) : (
                <Text ta="center" py="xl" style={{ color: theme.colors.textSecondary }}>
                  No notifications found
                </Text>
              )}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="unread" pt="md">
            <Stack gap="xs">
              {filteredNotifications.filter(n => !n.read).length > 0 ? (
                filteredNotifications
                  .filter(n => !n.read)
                  .map((notification) => (
                    <NotificationItem key={notification.id} notification={notification} />
                  ))
              ) : (
                <Text ta="center" py="xl" style={{ color: theme.colors.textSecondary }}>
                  No unread notifications
                </Text>
              )}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Container>
  );
};

export default NotificationsPage;
