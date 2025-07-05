import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Stack,
  Divider,
  Badge,
  Group,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconLogin,
  IconUser,
  IconLock,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => {
        if (!value) return "Email is required";
        if (!/^\S+@\S+$/.test(value)) return "Invalid email format";
        return null;
      },
      password: (value) => {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return null;
      },
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const success = await login(values.email, values.password);

      if (success) {
        notifications.show({
          title: 'Login Successful',
          message: 'Welcome back!',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        // Navigation will be handled by useEffect when isAuthenticated changes
      } else {
        notifications.show({
          title: 'Login Failed',
          message: 'Invalid credentials. Please try again.',
          color: 'red',
          icon: <IconAlertCircle size={16} />,
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Login Failed',
        message: 'An error occurred during login',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Container size={420}>
        <Paper
          radius="md"
          p="xl"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.lg,
            position: 'relative',
          }}
        >
          <LoadingOverlay
            visible={isLoading}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Stack gap="md">
            <div style={{ textAlign: "center" }}>
              <Title
                order={2}
                style={{
                  color: theme.colors.textPrimary,
                  marginBottom: "8px",
                }}
              >
                Welcome Back
              </Title>
              <Text size="sm" style={{ color: theme.colors.textSecondary }}>
                Sign in to your Food Ordering Admin account
              </Text>
            </div>

            <Divider />

            {/* Demo Credentials */}
            <div>
              <Text
                size="sm"
                fw={500}
                style={{ color: theme.colors.textPrimary, marginBottom: "8px" }}
              >
                Demo Credentials:
              </Text>
              <Group gap="xs" mb="xs">
                <Badge variant="light" color="blue">
                  Admin
                </Badge>
                <Text size="xs" style={{ color: theme.colors.textSecondary }}>
                  admin@foodorder.com / admin123
                </Text>
              </Group>
              <Group gap="xs">
                <Badge variant="light" color="green">
                  Manager
                </Badge>
                <Text size="xs" style={{ color: theme.colors.textSecondary }}>
                  manager@foodorder.com / manager123
                </Text>
              </Group>
            </div>

            <Divider />

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  placeholder="Enter your email"
                  leftSection={<IconUser size={16} />}
                  {...form.getInputProps("email")}
                  styles={{
                    input: {
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: theme.colors.inputBorder,
                      color: theme.colors.inputText,
                      "&::placeholder": {
                        color: theme.colors.inputPlaceholder,
                      },
                      "&:focus": {
                        borderColor: theme.colors.primary,
                      },
                    },
                    label: {
                      color: theme.colors.textPrimary,
                    },
                  }}
                />

                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  leftSection={<IconLock size={16} />}
                  {...form.getInputProps("password")}
                  styles={{
                    input: {
                      backgroundColor: theme.colors.inputBackground,
                      borderColor: theme.colors.inputBorder,
                      color: theme.colors.inputText,
                      "&::placeholder": {
                        color: theme.colors.inputPlaceholder,
                      },
                      "&:focus": {
                        borderColor: theme.colors.primary,
                      },
                    },
                    label: {
                      color: theme.colors.textPrimary,
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  leftSection={<IconLogin size={16} />}
                  style={{
                    backgroundColor: theme.colors.primary,
                    "&:hover": {
                      backgroundColor: theme.colors.primaryHover,
                    },
                  }}
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginPage;
