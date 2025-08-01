import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNotificationSound } from '../hooks/useNotificationSound';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'payment' | 'system';
  timestamp: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Order Received",
      message: "Order #1234 has been placed by John Doe",
      time: "2 minutes ago",
      read: false,
      type: "order",
      timestamp: Date.now() - 120000,
    },
    {
      id: 2,
      title: "Payment Confirmed",
      message: "Payment of $45.99 has been confirmed for Order #1233",
      time: "15 minutes ago",
      read: false,
      type: "payment",
      timestamp: Date.now() - 900000,
    },
    {
      id: 3,
      title: "System Update",
      message: "System maintenance completed successfully",
      time: "1 hour ago",
      read: true,
      type: "system",
      timestamp: Date.now() - 3600000,
    },
  ]);

  const { playNotificationSound } = useNotificationSound();

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      timestamp: Date.now(),
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Play sound for new notifications
    if (!notification.read) {
      playNotificationSound();
    }
  }, [playNotificationSound]);

  const markAsRead = useCallback((id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Simulate receiving new notifications (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add new notifications for demo
      if (Math.random() > 0.95) { // 5% chance every 5 seconds
        const orderTypes = ['New Order', 'Order Update', 'Payment Received'];
        const randomType = orderTypes[Math.floor(Math.random() * orderTypes.length)];
        
        addNotification({
          title: randomType,
          message: `${randomType} #${Math.floor(Math.random() * 9999)} - Check details`,
          time: 'Just now',
          read: false,
          type: 'order',
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [addNotification]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
