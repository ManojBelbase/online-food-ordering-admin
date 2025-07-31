import React, { useState } from "react";
import {
  Card,
  Title,
  Group,
  Stack,
  Badge,
  Divider,
  Modal,
  PasswordInput,
  Alert,
  Progress,
  List,
  Switch,
} from "@mantine/core";
import {
  IconShield,
  IconKey,
  IconSettings,
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconDevices,
  IconLock,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useTheme } from "../../../contexts/ThemeContext";
import { CustomText, ActionButton } from "../../../components/ui";

const SecurityTab: React.FC = () => {
  const { theme } = useTheme();
  const [changePasswordOpened, setChangePasswordOpened] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return Math.min(strength, 100);
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return "red";
    if (strength < 60) return "yellow";
    if (strength < 80) return "orange";
    return "green";
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notifications.show({
        title: "Password Mismatch",
        message: "New passwords do not match. Please try again.",
        color: "red",
        icon: <IconX size={16} />,
        autoClose: 4000,
      });
      return;
    }

    if (passwordStrength < 60) {
      notifications.show({
        title: "Weak Password",
        message: "Please choose a stronger password with better security.",
        color: "orange",
        icon: <IconAlertTriangle size={16} />,
        autoClose: 5000,
      });
      return;
    }

    // Simulate password change
    notifications.show({
      title: "Password Changed",
      message: "Your password has been successfully updated.",
      color: "green",
      icon: <IconCheck size={16} />,
      autoClose: 4000,
    });

    setChangePasswordOpened(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const mockSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, US",
      lastActive: "Active now",
      current: true,
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "New York, US",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      device: "Firefox on MacOS",
      location: "Los Angeles, US",
      lastActive: "1 day ago",
      current: false,
    },
  ];

  return (
    <>
      <Card
        shadow="sm"
        padding="xl"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
        }}
      >
        <Group justify="space-between" mb="md">
          <Title order={3} style={{ color: theme.colors.textPrimary }}>
            <Group gap="xs">
              <IconShield size={20} />
              Security Settings
            </Group>
          </Title>
        </Group>

        <Stack gap="lg">
          {/* Change Password */}
          <Group justify="space-between">
            <div>
              <CustomText fontWeight={500} color="primary">
                Change Password
              </CustomText>
              <CustomText size="sm" color="secondary">
                Update your password to keep your account secure
              </CustomText>
            </div>
            <ActionButton
              variant="outline"
              onClick={() => setChangePasswordOpened(true)}
            >
              <IconKey size={16} style={{ marginRight: '8px' }} />
              Change Password
            </ActionButton>
          </Group>

          <Divider />

          {/* Two-Factor Authentication */}
          <Group justify="space-between">
            <div>
              <CustomText fontWeight={500} color="primary">
                Two-Factor Authentication
              </CustomText>
              <CustomText size="sm" color="secondary">
                Add an extra layer of security to your account
              </CustomText>
            </div>
            <Group gap="md">
              <Badge color={twoFactorEnabled ? "green" : "red"} variant="light">
                {twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
              <Switch
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.currentTarget.checked)}
              />
            </Group>
          </Group>

          <Divider />

          {/* Login Sessions */}
          <div>
            <Group justify="space-between" mb="md">
              <div>
                <CustomText fontWeight={500} color="primary">
                  Active Sessions
                </CustomText>
                <CustomText size="sm" color="secondary">
                  Manage your active login sessions across devices
                </CustomText>
              </div>
              <ActionButton variant="outline">
                <IconSettings size={16} style={{ marginRight: '8px' }} />
                Manage All
              </ActionButton>
            </Group>

            <Stack gap="sm">
              {mockSessions.map((session) => (
                <Card
                  key={session.id}
                  padding="md"
                  style={{
                    backgroundColor: session.current 
                      ? `${theme.colors.primary}10` 
                      : theme.colors.background,
                    border: `1px solid ${session.current ? theme.colors.primary : theme.colors.border}`,
                  }}
                >
                  <Group justify="space-between">
                    <Group gap="md">
                      <IconDevices size={20} style={{ color: theme.colors.textSecondary }} />
                      <div>
                        {/* <Text size="sm" fw={500} style={{ color: theme.colors.textPrimary }}>
                          {session.device}
                          {session.current && (
                            <Badge size="xs" color="green" ml="xs">
                              Current
                            </Badge>
                          )}
                        </Text> */}
                        <CustomText size="xs" color="secondary">
                          {session.location} • {session.lastActive}
                        </CustomText>
                      </div>
                    </Group>
                    {!session.current && (
                      <ActionButton size="xs" variant="error">
                        Revoke
                      </ActionButton>
                    )}
                  </Group>
                </Card>
              ))}
            </Stack>
          </div>

          <Divider />

          {/* Security Recommendations */}
          <div>
            <CustomText fontWeight={500} margin="0 0 16px 0" color="primary">
              Security Recommendations
            </CustomText>
            <List
              spacing="xs"
              size="sm"
              icon={<IconCheck size={16} color={theme.colors.success} />}
            >
              <List.Item style={{ color: theme.colors.textSecondary }}>
                Use a strong, unique password
              </List.Item>
              <List.Item style={{ color: theme.colors.textSecondary }}>
                Enable two-factor authentication
              </List.Item>
              <List.Item style={{ color: theme.colors.textSecondary }}>
                Regularly review active sessions
              </List.Item>
              <List.Item style={{ color: theme.colors.textSecondary }}>
                Keep your browser and devices updated
              </List.Item>
            </List>
          </div>
        </Stack>
      </Card>

      {/* Change Password Modal */}
      <Modal
        opened={changePasswordOpened}
        onClose={() => setChangePasswordOpened(false)}
        title={
          <Group gap="xs">
            <IconLock size={20} style={{ color: theme.colors.primary }} />
            <CustomText fontWeight={600} color="primary">Change Password</CustomText>
          </Group>
        }
        size="md"
        centered
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        styles={{
          content: {
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
          },
          header: {
            backgroundColor: theme.colors.surface,
            borderBottom: `1px solid ${theme.colors.border}`,
            padding: '20px 24px 16px 24px',
          },
          body: {
            backgroundColor: theme.colors.surface,
            padding: '0 24px 24px 24px',
          },
          close: {
            color: theme.colors.textSecondary,
            '&:hover': {
              backgroundColor: theme.colors.primaryLight,
            },
          },
        }}
      >
        <Stack gap="md">
          <PasswordInput
            label="Current Password"
            placeholder="Enter your current password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, currentPassword: e.target.value })
            }
            styles={{
              input: {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.inputText,
              },
              label: {
                color: theme.colors.textPrimary,
              },
            }}
          />

          <PasswordInput
            label="New Password"
            placeholder="Enter your new password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            styles={{
              input: {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.inputText,
              },
              label: {
                color: theme.colors.textPrimary,
              },
            }}
          />

          {passwordData.newPassword && (
            <div>
              <Group justify="space-between" mb="xs">
                <CustomText size="sm" color="primary">
                  Password Strength
                </CustomText>
                <CustomText size="sm" color="secondary">
                  {getStrengthLabel(passwordStrength)}
                </CustomText>
              </Group>
              <Progress
                value={passwordStrength}
                color={getStrengthColor(passwordStrength)}
                size="sm"
              />
            </div>
          )}

          <PasswordInput
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, confirmPassword: e.target.value })
            }
            error={
              passwordData.confirmPassword &&
              passwordData.newPassword !== passwordData.confirmPassword
                ? "Passwords do not match"
                : null
            }
            styles={{
              input: {
                backgroundColor: theme.colors.inputBackground,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.inputText,
              },
              label: {
                color: theme.colors.textPrimary,
              },
            }}
          />

          <Alert
            icon={<IconAlertTriangle size={16} />}
            title="Password Requirements"
            color="blue"
            variant="light"
          >
            <List size="xs">
              <List.Item>At least 8 characters long</List.Item>
              <List.Item>Contains uppercase and lowercase letters</List.Item>
              <List.Item>Contains at least one number</List.Item>
              <List.Item>Contains at least one special character</List.Item>
            </List>
          </Alert>

          <Group justify="flex-end" mt="md">
            <ActionButton
              variant="outline"
              onClick={() => setChangePasswordOpened(false)}
            >
              Cancel
            </ActionButton>
            <ActionButton
              onClick={handleChangePassword}
              disabled={
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword ||
                passwordData.newPassword !== passwordData.confirmPassword
              }
              variant="primary"
            >
              Change Password
            </ActionButton>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default SecurityTab;
