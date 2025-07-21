import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Paper,
  ThemeIcon,
  Box,
  Divider,
} from '@mantine/core';
import {
  IconHome,
  IconArrowLeft,
  IconSearch,
  IconAlertTriangle,
} from '@tabler/icons-react';
import { useTheme } from '../../contexts/ThemeContext';

const NotFoundPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: theme.colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Container size="md">
        <Paper
          radius="lg"
          p="xl"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.lg,
            textAlign: 'center',
          }}
        >
          <Stack gap="xl" align="center">
            {/* 404 Icon */}
            <ThemeIcon
              size={120}
              radius="xl"
              variant="light"
              color="orange"
              style={{
                backgroundColor: `${theme.colors.warning}15`,
              }}
            >
              <IconAlertTriangle size={60} color={theme.colors.warning} />
            </ThemeIcon>

            {/* 404 Text */}
            <Stack gap="md" align="center">
              <Title
                order={1}
                size="4rem"
                fw={900}
                style={{
                  color: theme.colors.primary,
                  background: `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                404
              </Title>
              
              <Title
                order={2}
                size="2rem"
                fw={600}
                style={{ color: theme.colors.textPrimary }}
              >
                Page Not Found
              </Title>
              
              <Text
                size="lg"
                c="dimmed"
                style={{
                  color: theme.colors.textSecondary,
                  maxWidth: '500px',
                  lineHeight: 1.6,
                }}
              >
                Oops! The page you're looking for doesn't exist. It might have been moved, 
                deleted, or you entered the wrong URL.
              </Text>
            </Stack>

            <Divider
              w="100%"
              style={{ borderColor: theme.colors.border }}
            />

            {/* Action Buttons */}
            <Group gap="md" justify="center">
              <Button
                leftSection={<IconHome size={16} />}
                variant="filled"
                size="md"
                onClick={handleGoHome}
                style={{
                  backgroundColor: theme.colors.primary,
                  '&:hover': {
                    backgroundColor: theme.colors.primaryHover,
                  },
                }}
              >
                Go Home
              </Button>

              <Button
                leftSection={<IconSearch size={16} />}
                variant="light"
                size="md"
                onClick={handleGoToDashboard}
                style={{
                  backgroundColor: `${theme.colors.primary}15`,
                  color: theme.colors.primary,
                  '&:hover': {
                    backgroundColor: `${theme.colors.primary}25`,
                  },
                }}
              >
                Dashboard
              </Button>

              <Button
                leftSection={<IconArrowLeft size={16} />}
                variant="outline"
                size="md"
                onClick={handleGoBack}
                style={{
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary,
                  '&:hover': {
                    backgroundColor: theme.colors.surface,
                  },
                }}
              >
                Go Back
              </Button>
            </Group>

            {/* Help Text */}
            <Text
              size="sm"
              c="dimmed"
              style={{
                color: theme.colors.textSecondary,
                marginTop: '20px',
              }}
            >
              Need help? Contact our support team or check the navigation menu above.
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
