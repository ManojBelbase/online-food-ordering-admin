import React from 'react';
import {
  Center,
  Stack,
  Text,
  Box,
  Skeleton,
  Group,
  Paper,
} from '@mantine/core';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingSpinner from './LoadingSpinner';

interface PageLoaderProps {
  type?: 'spinner' | 'skeleton' | 'custom';
  message?: string;
  showSkeleton?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({
  type = 'spinner',
  message = 'Loading page...',
  showSkeleton = false,
}) => {
  const { theme } = useTheme();

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (type === 'skeleton' || showSkeleton) {
    return (
      <Box
        style={{
          minHeight: '100vh',
          backgroundColor: theme.colors.background,
          padding: '20px',
        }}
      >
        {/* Header Skeleton */}
        <Paper
          p="md"
          mb="md"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <Group justify="space-between" align="center">
            <Stack gap="xs">
              <Skeleton height={24} width={200} />
              <Skeleton height={16} width={300} />
            </Stack>
            <Skeleton height={36} width={120} />
          </Group>
        </Paper>

        {/* Content Skeleton */}
        <Paper
          p="md"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* Table Header */}
          <Group justify="space-between" mb="md">
            <Skeleton height={20} width={150} />
            <Group gap="sm">
              <Skeleton height={32} width={100} />
              <Skeleton height={32} width={80} />
            </Group>
          </Group>

          {/* Table Rows */}
          <Stack gap="sm">
            {Array.from({ length: 8 }).map((_, index) => (
              <Group key={index} gap="md" align="center">
                <Skeleton height={16} width={40} />
                <Skeleton height={16} width={120} />
                <Skeleton height={16} width={150} />
                <Skeleton height={16} width={100} />
                <Skeleton height={16} width={80} />
                <Skeleton height={16} width={60} />
                <Skeleton height={16} width={90} />
                <Skeleton height={16} width={70} />
                <Skeleton height={24} width={24} radius="xl" />
              </Group>
            ))}
          </Stack>

          {/* Pagination Skeleton */}
          <Group justify="space-between" mt="md" pt="md">
            <Skeleton height={16} width={200} />
            <Group gap="xs">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} height={32} width={32} radius="sm" />
              ))}
            </Group>
          </Group>
        </Paper>
      </Box>
    );
  }

  if (type === 'custom') {
    return (
      <Center
        style={{
          minHeight: '100vh',
          backgroundColor: theme.colors.background,
        }}
      >
        <Stack gap="xl" align="center">
          {/* Custom animated loader */}
          <Box
            style={{
              width: '80px',
              height: '80px',
              position: 'relative',
            }}
          >
            {/* Rotating circles */}
            {Array.from({ length: 3 }).map((_, index) => (
              <Box
                key={index}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  border: `3px solid ${theme.colors.primary}`,
                  borderTop: '3px solid transparent',
                  borderRadius: '50%',
                  animation: `spin ${1 + index * 0.5}s linear infinite`,
                  animationDelay: `${index * 0.2}s`,
                  transform: `scale(${1 - index * 0.2})`,
                }}
              />
            ))}
          </Box>

          <Stack gap="sm" align="center">
            <Text
              size="lg"
              fw={600}
              style={{ color: theme.colors.textPrimary }}
            >
              Food Ordering Admin
            </Text>
            <Text
              size="sm"
              c="dimmed"
              style={{ color: theme.colors.textSecondary }}
            >
              {message}
            </Text>
          </Stack>
        </Stack>
      </Center>
    );
  }

  // Default spinner
  return (
    <LoadingSpinner
      variant="branded"
      message={message}
      fullScreen={true}
      size="lg"
    />
  );
};

export default PageLoader;
