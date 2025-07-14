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
import { useAppDispatch, useAuth } from "../redux/useAuth";
import { loginUser } from "../server-action/api/authThunk";
import { loginValidators } from "../validation/authValidation";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { loadingLogin, errorLogin, isAuthenticated } = useAuth();

  const from = location.state?.from?.pathname || "/";

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidators,
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const result = await dispatch(loginUser(values));

      if (loginUser.fulfilled.match(result)) {
        notifications.show({
          title: 'Login Successful',
          message: 'Welcome back!',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
        navigate(from, { replace: true });
      } else if (loginUser.rejected.match(result)) {

        notifications.show({
          title: 'Login Failed',
          message: result.payload as string || 'Invalid credentials',
          color: 'red',
          icon: <IconAlertCircle size={16} />,
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Login Failedfdfd',
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
            visible={loadingLogin}
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
                  loading={loadingLogin}
                  leftSection={!loadingLogin ? <IconLogin size={16} /> : undefined}
                  style={{
                    backgroundColor: theme.colors.primary,
                    "&:hover": {
                      backgroundColor: theme.colors.primaryHover,
                    },
                  }}
                >
                  {loadingLogin ? 'Signing In...' : 'Sign In'}
                </Button>

                {errorLogin && (
                  <Text size="sm" c="red" ta="center">
                    {errorLogin}
                  </Text>
                )}
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginPage;
