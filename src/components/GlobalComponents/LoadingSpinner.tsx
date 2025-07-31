import React from 'react';
import {
  Center,
  Loader,
  Stack,
  Box,
  Paper,
  ThemeIcon,
  Group,
  Progress,
} from '@mantine/core';
import { IconChefHat, IconToolsKitchen2 } from '@tabler/icons-react';
import { useTheme } from '../../contexts/ThemeContext';
import { CustomText } from '../ui';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  showProgress?: boolean;
  progress?: number;
  variant?: 'simple' | 'branded' | 'detailed';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
  fullScreen = false,
  showProgress = false,
  progress = 0,
  variant = 'simple',
}) => {
  const { theme } = useTheme();

  const containerStyle = fullScreen
    ? {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: `${theme.colors.background}95`,
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
      }
    : {};

  const renderSimpleLoader = () => (
    <Center style={containerStyle}>
      <Stack gap="md" align="center">
        <Loader
          size={size}
          color={theme.colors.primary}
          type="dots"
        />
        {message && (
          <CustomText
            size="sm"
            color="secondary"
          >
            {message}
          </CustomText>
        )}
        {showProgress && (
          <Progress
            value={progress}
            size="sm"
            radius="xl"
            w={200}
            color={theme.colors.primary}
          />
        )}
      </Stack>
    </Center>
  );

  const renderBrandedLoader = () => (
    <Center style={containerStyle}>
      <Paper
        radius="lg"
        p="xl"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.md,
        }}
      >
        <Stack gap="lg" align="center">
          {/* Animated Food Icon */}
          <Box
            style={{
              animation: 'pulse 2s infinite',
            }}
          >
            <ThemeIcon
              size={60}
              radius="xl"
              variant="light"
              color={theme.colors.primary}
              style={{
                backgroundColor: `${theme.colors.primary}15`,
              }}
            >
              <IconChefHat size={30} />
            </ThemeIcon>
          </Box>

          <Stack gap="sm" align="center">
            <CustomText
              size="lg"
              fontWeight={600}
              color="primary"
            >
              Food Ordering Admin
            </CustomText>
            <CustomText
              size="sm"
              color="secondary"
            >
              {message}
            </CustomText>
          </Stack>

          <Loader
            size="md"
            color={theme.colors.primary}
            type="bars"
          />

          {showProgress && (
            <Box w={250}>
              <Progress
                value={progress}
                size="sm"
                radius="xl"
                color={theme.colors.primary}
                striped
                animated
              />
              <CustomText
                size="xs"
                color="secondary"
                textAlign="center"
                margin="8px 0 0 0"
              >
                {progress}% Complete
              </CustomText>
            </Box>
          )}
        </Stack>
      </Paper>
    </Center>
  );

  const renderDetailedLoader = () => (
    <Center style={containerStyle}>
      <Paper
        radius="lg"
        p="xl"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: theme.shadows.lg,
          minWidth: '300px',
        }}
      >
        <Stack gap="lg" align="center">
          {/* Animated Icons */}
          <Group gap="md">
            <Box
              style={{
                animation: 'bounce 1s infinite',
                animationDelay: '0s',
              }}
            >
              <ThemeIcon
                size={40}
                radius="xl"
                variant="light"
                color="orange"
              >
                <IconChefHat size={20} />
              </ThemeIcon>
            </Box>
            <Box
              style={{
                animation: 'bounce 1s infinite',
                animationDelay: '0.2s',
              }}
            >
              <ThemeIcon
                size={40}
                radius="xl"
                variant="light"
                color="green"
              >
                <IconToolsKitchen2 size={20} />
              </ThemeIcon>
            </Box>
            <Box
              style={{
                animation: 'bounce 1s infinite',
                animationDelay: '0.4s',
              }}
            >
              <ThemeIcon
                size={40}
                radius="xl"
                variant="light"
                color="blue"
              >
                <IconChefHat size={20} />
              </ThemeIcon>
            </Box>
          </Group>

          <Stack gap="sm" align="center">
            <CustomText
              size="xl"
              fontWeight={700}
              style={{
                background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Food Ordering
            </CustomText>
            <CustomText
              size="md"
              fontWeight={500}
              color="primary"
            >
              {message}
            </CustomText>
          </Stack>

          <Loader
            size="lg"
            color={theme.colors.primary}
            type="dots"
          />

          {showProgress && (
            <Box w="100%">
              <Progress
                value={progress}
                size="md"
                radius="xl"
                color={theme.colors.primary}
                striped
                animated
              />
              <Group justify="space-between" style={{ marginTop: '8px' }}>
                <CustomText
                  size="xs"
                  color="secondary"
                >
                  Loading...
                </CustomText>
                <CustomText
                  size="xs"
                  fontWeight={500}
                  style={{ color: theme.colors.primary }}
                >
                  {progress}%
                </CustomText>
              </Group>
            </Box>
          )}
        </Stack>
      </Paper>
    </Center>
  );

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.1); opacity: 0.8; }
      }
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  switch (variant) {
    case 'branded':
      return renderBrandedLoader();
    case 'detailed':
      return renderDetailedLoader();
    default:
      return renderSimpleLoader();
  }
};

export default LoadingSpinner;
