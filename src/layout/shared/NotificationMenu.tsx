import React, { useState } from "react";
import {
  ActionIcon,
  Badge,
  Indicator,
  Popover,
  Stack,
  ScrollArea,
  UnstyledButton,
  Group,
} from "@mantine/core";
import { CustomText, ActionButton } from "../../components/ui";
import {
  IconBell,
  IconNotification,
} from "@tabler/icons-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useNotifications } from "../../contexts/NotificationContext";

interface NotificationMenuProps {
  // Add any props you need
}

const NotificationMenu: React.FC<NotificationMenuProps> = () => {
  const { theme } = useTheme();
  const [notificationsOpened, setNotificationsOpened] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();


  return (
    <Popover
      width={320}
      position="bottom-end"
      withArrow
      shadow="md"
      opened={notificationsOpened}
      onChange={setNotificationsOpened}
      zIndex={9999}
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          style={{ color: theme.colors.textSecondary }}
          onClick={() => setNotificationsOpened(!notificationsOpened)}
        >
          <Indicator
            inline
            label={unreadCount > 0 ? unreadCount.toString() : undefined}
            size={18}
            color="red"
            disabled={unreadCount === 0}
            styles={{
              indicator: {
                fontSize: '10px',
                fontWeight: 700,
                minWidth: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                zIndex: 10,
                position: 'absolute',
                top: '-2px',
                right: '-2px',
              }
            }}
          >
            <IconBell size={20} />
          </Indicator>
        </ActionIcon>
      </Popover.Target>
      
      <Popover.Dropdown
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          padding: 0,
        }}
      >
        <div style={{ padding: '16px 16px 8px 16px', borderBottom: `1px solid ${theme.colors.border}` }}>
          <Group justify="space-between" align="center">
            <CustomText fontWeight={600} color="primary">
              Notifications
            </CustomText>
            {unreadCount > 0 && (
              <Badge size="sm" color="red" variant="filled">
                {unreadCount} new
              </Badge>
            )}
          </Group>
        </div>
        
        <ScrollArea h={300}>
          <Stack gap={0}>
            {notifications.map((notification) => (
              <UnstyledButton
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  textAlign: 'left',
                  backgroundColor: !notification.read ? theme.colors.surfaceHover : 'transparent',
                  borderBottom: `1px solid ${theme.colors.border}`,
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    backgroundColor: theme.colors.surfaceHover,
                  }
                }}
              >
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <CustomText size="sm" fontWeight={500} color="primary" style={{ marginBottom: '4px' }}>
                      {notification.title}
                    </CustomText>
                    <CustomText size="xs" color="secondary" style={{ 
                      marginBottom: '4px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {notification.message}
                    </CustomText>
                    <CustomText size="xs" color="tertiary">
                      {notification.time}
                    </CustomText>
                  </div>
                  {!notification.read && (
                    <ActionIcon size="xs" variant="subtle">
                      <IconNotification size={12} />
                    </ActionIcon>
                  )}
                </Group>
              </UnstyledButton>
            ))}
          </Stack>
        </ScrollArea>
        
        <div style={{ padding: '8px 16px', borderTop: `1px solid ${theme.colors.border}` }}>
          <Group gap="xs">
            <ActionButton
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              style={{ flex: 1 }}
            >
              Mark all read
            </ActionButton>
            <ActionButton
              variant="primary"
              size="sm"
              onClick={() => setNotificationsOpened(false)}
              style={{ flex: 1 }}
            >
              View all
            </ActionButton>
          </Group>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export default NotificationMenu;
