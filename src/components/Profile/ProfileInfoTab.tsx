import React, { useState } from "react";
import {
  Card,
  Title,
  Group,
  Avatar,
  Button,
  TextInput,
  Textarea,
  Grid,
  Badge,
  ActionIcon,
  Stack,
  Box,
} from "@mantine/core";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconEdit,
  IconCamera,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { useAuth } from "../../redux/useAuth";
import { updateUser } from "../../redux/slices/authSlice";
import { useTheme } from "../../contexts/ThemeContext";
import { notifications } from "@mantine/notifications";

const ProfileInfoTab: React.FC = () => {
  const { user, dispatch } = useAuth();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    bio: "Food service administrator with 5+ years of experience managing restaurant operations.",
    department: "Operations",
    position: "Senior Administrator",
  });

  const handleSave = () => {
    try {
      dispatch(updateUser({
        name: formData.name,
        email: formData.email,
      }));
      setIsEditing(false);

      notifications.show({
        title: 'Profile Updated',
        message: 'Your profile information has been successfully updated.',
        color: 'green',
        icon: <IconCheck size={16} />,
        autoClose: 4000,
      });
    } catch (error) {
      notifications.show({
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.',
        color: 'red',
        icon: <IconX size={16} />,
        autoClose: 4000,
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      ...formData,
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);

    notifications.show({
      title: 'Changes Cancelled',
      message: 'Your changes have been discarded.',
      color: 'orange',
      autoClose: 3000,
    });
  };

  return (
    <Card
      shadow="sm"
      padding="xl"
      w={"100%"}
      style={{
        backgroundColor: theme.colors.surface,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <Group justify="space-between" mb="md">
        <Title order={3} style={{ color: theme.colors.textPrimary }}>
          Profile Information
        </Title>
        <Button
          variant="light"
          leftSection={<IconEdit size={16} />}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </Group>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack align="center" gap="md">
            <Box pos="relative">
              <Avatar
                src={user?.avatar}
                size={120}
                radius="xl"
                style={{
                  border: `3px solid ${theme.colors.primary}`,
                }}
              />
              {isEditing && (
                <ActionIcon
                  variant="filled"
                  radius="xl"
                  size="sm"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    backgroundColor: theme.colors.primary,
                  }}
                >
                  <IconCamera size={14} />
                </ActionIcon>
              )}
            </Box>
            <Badge
              variant="light"
              color="blue"
              size="lg"
              style={{ textTransform: "capitalize" }}
            >
              {user?.role}
            </Badge>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <TextInput
              label="Full Name"
              placeholder="Enter your full name"
              leftSection={<IconUser size={16} />}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              readOnly={!isEditing}
              styles={{
                input: {
                  backgroundColor: isEditing ? theme.colors.inputBackground : theme.colors.surface,
                  borderColor: theme.colors.inputBorder,
                  color: theme.colors.inputText,
                },
                label: {
                  color: theme.colors.textPrimary,
                },
              }}
            />

            <TextInput
              label="Email Address"
              placeholder="Enter your email"
              leftSection={<IconMail size={16} />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              readOnly={!isEditing}
              styles={{
                input: {
                  backgroundColor: isEditing ? theme.colors.inputBackground : theme.colors.surface,
                  borderColor: theme.colors.inputBorder,
                  color: theme.colors.inputText,
                },
                label: {
                  color: theme.colors.textPrimary,
                },
              }}
            />

            <TextInput
              label="Phone Number"
              placeholder="Enter your phone number"
              leftSection={<IconPhone size={16} />}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              readOnly={!isEditing}
              styles={{
                input: {
                  backgroundColor: isEditing ? theme.colors.inputBackground : theme.colors.surface,
                  borderColor: theme.colors.inputBorder,
                  color: theme.colors.inputText,
                },
                label: {
                  color: theme.colors.textPrimary,
                },
              }}
            />

            <TextInput
              label="Address"
              placeholder="Enter your address"
              leftSection={<IconMapPin size={16} />}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              readOnly={!isEditing}
              styles={{
                input: {
                  backgroundColor: isEditing ? theme.colors.inputBackground : theme.colors.surface,
                  borderColor: theme.colors.inputBorder,
                  color: theme.colors.inputText,
                },
                label: {
                  color: theme.colors.textPrimary,
                },
              }}
            />

            <Grid>
              <Grid.Col span={6}>
                <TextInput
                  label="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  readOnly={!isEditing}
                  styles={{
                    input: {
                      backgroundColor: isEditing ? theme.colors.inputBackground : theme.colors.surface,
                      borderColor: theme.colors.inputBorder,
                      color: theme.colors.inputText,
                    },
                    label: {
                      color: theme.colors.textPrimary,
                    },
                  }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  readOnly={!isEditing}
                  styles={{
                    input: {
                      backgroundColor: isEditing ? theme.colors.inputBackground : theme.colors.surface,
                      borderColor: theme.colors.inputBorder,
                      color: theme.colors.inputText,
                    },
                    label: {
                      color: theme.colors.textPrimary,
                    },
                  }}
                />
              </Grid.Col>
            </Grid>

            <Textarea
              label="Bio"
              placeholder="Tell us about yourself"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              readOnly={!isEditing}
              minRows={3}
              styles={{
                input: {
                  backgroundColor: isEditing ? theme.colors.inputBackground : theme.colors.surface,
                  borderColor: theme.colors.inputBorder,
                  color: theme.colors.inputText,
                },
                label: {
                  color: theme.colors.textPrimary,
                },
              }}
            />

            {isEditing && (
              <Group justify="flex-end" mt="md">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </Group>
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default ProfileInfoTab;
