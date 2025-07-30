import React, { useEffect, useState } from "react";
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
  Tabs,
  Group,
  Box,
  Divider,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconLogin,
  IconUser,
  IconLock,
  IconCheck,
  IconAlertCircle,
  IconFaceId,
  IconKey,
  IconShieldCheck,
} from "@tabler/icons-react";
import { useTheme } from "../contexts/ThemeContext";
import { useAppDispatch, useAuth } from "../redux/useAuth";
import { loginUser } from "../server-action/authThunk";
import { loginValidators } from "../validation/authValidation";
import FaceLogin from "../components/FaceLogin";

interface LoginFormValues {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("credentials");

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
          title: 'Welcome Back!',
          message: 'Login successful',
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
        title: 'Error',
        message: 'An error occurred during login',
        color: 'red',
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const handleSwitchToCredentials = () => {
    setActiveTab("credentials");
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Container size={480}>
        <Paper
          radius="lg"
          p={0}
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            position: 'relative',
          }}
        >
          <LoadingOverlay
            visible={loadingLogin}
            overlayProps={{ radius: "lg", blur: 2 }}
          />

          {/* Header Section */}
          <Box
            p="xl"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              textAlign: "center",
            }}
          >
            <IconShieldCheck size={48} style={{ marginBottom: "16px", opacity: 0.9 }} />
            <Title order={1} size="h2" fw={600} mb="xs">
              Admin Portal
            </Title>
            <Text size="sm" style={{ opacity: 0.9 }}>
              Food Ordering System Management
            </Text>
          </Box>

          {/* Content Section */}
          <Box p="xl">
            <Tabs
              value={activeTab}
              onChange={(value) => setActiveTab(value || "credentials")}
              variant="pills"
              radius="md"
            >
              <Tabs.List grow mb="xl">
                <Tabs.Tab 
                  value="credentials" 
                  leftSection={<IconKey size={18} />}
                  style={{ fontSize: "14px", fontWeight: 500 }}
                >
                  Password Login
                </Tabs.Tab>
                <Tabs.Tab 
                  value="face" 
                  leftSection={<IconFaceId size={18} />}
                  style={{ fontSize: "14px", fontWeight: 500 }}
                >
                  Face Recognition
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="credentials">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="lg">
                    <TextInput
                      label="Email Address"
                      placeholder="Enter your email"
                      leftSection={<IconUser size={18} />}
                      size="md"
                      {...form.getInputProps("email")}
                      styles={{
                        input: {
                          backgroundColor: theme.colors.inputBackground,
                          borderColor: theme.colors.inputBorder,
                          color: theme.colors.inputText,
                          fontSize: "14px",
                          height: "48px",
                          "&::placeholder": {
                            color: theme.colors.inputPlaceholder,
                          },
                          "&:focus": {
                            borderColor: theme.colors.primary,
                            boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
                          },
                        },
                        label: {
                          color: theme.colors.textPrimary,
                          fontSize: "14px",
                          fontWeight: 500,
                          marginBottom: "8px",
                        },
                      }}
                    />

                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      leftSection={<IconLock size={18} />}
                      size="md"
                      {...form.getInputProps("password")}
                      styles={{
                        input: {
                          backgroundColor: theme.colors.inputBackground,
                          borderColor: theme.colors.inputBorder,
                          color: theme.colors.inputText,
                          fontSize: "14px",
                          height: "48px",
                          "&::placeholder": {
                            color: theme.colors.inputPlaceholder,
                          },
                          "&:focus": {
                            borderColor: theme.colors.primary,
                            boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
                          },
                        },
                        label: {
                          color: theme.colors.textPrimary,
                          fontSize: "14px",
                          fontWeight: 500,
                          marginBottom: "8px",
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      fullWidth
                      size="md"
                      loading={loadingLogin}
                      leftSection={!loadingLogin ? <IconLogin size={18} /> : undefined}
                      style={{
                        backgroundColor: theme.colors.primary,
                        height: "48px",
                        fontSize: "14px",
                        fontWeight: 600,
                        "&:hover": {
                          backgroundColor: theme.colors.primaryHover,
                          transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      {loadingLogin ? 'Signing In...' : 'Sign In'}
                    </Button>

                    {errorLogin && (
                      <Text size="sm" c="red" ta="center" p="sm" 
                        style={{ 
                          backgroundColor: "#fee", 
                          borderRadius: "6px",
                          border: "1px solid #fcc"
                        }}
                      >
                        {errorLogin}
                      </Text>
                    )}
                  </Stack>
                </form>
              </Tabs.Panel>

              <Tabs.Panel value="face">
                <FaceLogin onSwitchToCredentials={handleSwitchToCredentials} />
                
                <Divider my="xl" label="Alternative Options" labelPosition="center" />
                
                <Group justify="center">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => navigate('/face-align')}
                    leftSection={<IconFaceId size={16} />}
                  >
                    Face Alignment Setup
                  </Button>
                </Group>
              </Tabs.Panel>
            </Tabs>
          </Box>

          {/* Footer */}
          <Box
            p="md"
            style={{
              backgroundColor: theme.colors.background,
              borderTop: `1px solid ${theme.colors.border}`,
              textAlign: "center",
            }}
          >
            <Text size="xs" c="dimmed">
              Secure authentication powered by advanced face recognition
            </Text>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;