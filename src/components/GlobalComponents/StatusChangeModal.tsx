import React, { useState } from 'react';
import { Modal, Select, Button, Group, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useTheme } from '../../contexts/ThemeContext';

interface StatusChangeModalProps {
  opened: boolean;
  currentStatus: string;
  orderId: string;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: string) => Promise<void>;
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'completed', label: 'Completed' },
];

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  opened,
  currentStatus,
  orderId,
  onClose,
  onStatusChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const handleStatusUpdate = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setLoading(true);
    try {
      await onStatusChange(orderId, selectedStatus);
      notifications.show({
        title: 'Success',
        message: 'Order status updated successfully',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
      onClose();
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update order status',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset selected status when modal opens
  React.useEffect(() => {
    if (opened) {
      setSelectedStatus(currentStatus);
    }
  }, [opened, currentStatus]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Change Order Status"
      size="sm"
      styles={{
        content: {
          backgroundColor: theme.colors.backgroundPrimary,
        },
        header: {
          backgroundColor: theme.colors.backgroundPrimary,
          borderBottom: `1px solid ${theme.colors.border}`,
        },
        title: {
          color: theme.colors.textPrimary,
          fontWeight: 600,
        },
      }}
    >
      <div style={{ padding: '16px 0' }}>
        <Text size="sm" mb="xs" style={{ color: theme.colors.textSecondary }}>
          Current Status: <strong style={{ color: theme.colors.textPrimary }}>{currentStatus}</strong>
        </Text>
        
        <Select
          label="New Status"
          data={statusOptions}
          value={selectedStatus}
          onChange={(value) => setSelectedStatus(value || currentStatus)}
          size="sm"
          mb="lg"
          styles={{
            label: {
              color: theme.colors.textPrimary,
              fontWeight: 500,
            },
            input: {
              backgroundColor: theme.colors.backgroundSecondary,
              borderColor: theme.colors.border,
              color: theme.colors.textPrimary,
            },
          }}
        />
        
        <Group justify="flex-end" gap="sm">
          <Button
            variant="subtle"
            onClick={onClose}
            disabled={loading}
            color="gray"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            loading={loading}
            disabled={selectedStatus === currentStatus}
          >
            Update Status
          </Button>
        </Group>
      </div>
    </Modal>
  );
};

export default StatusChangeModal;
