
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Card,
  Group,
  Switch,
  Divider,
  Title,
  Grid,
  Paper,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useRestaurantByUser } from "../../../hooks/useRestaurantByUser";
import { FormImageUpload, FormInput } from "../../../components/Forms";
import { CuisineType } from "../../../constants/cuisine-type";
import { useCloudinaryUpload } from "../../../hooks/useCloudinaryUpload";
import { restaurantApi } from "../../../server-action/api/restaurant";
import LocationSelectorMap from "../../../components/LocationSelectorMap";

const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const ProfileInfoTab: React.FC = () => {
  const { restaurant, isLoading } = useRestaurantByUser();
  const { uploadImage, error: uploadError, loading: uploadLoading } = useCloudinaryUpload();
  const { mutateAsync: updateRestaurant, isPending: updateLoading } = restaurantApi.useUpdate();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  const form = useForm({
    initialValues: {
      restaurantName: "",
      address: "",
      cuisineType: "Other",
      licenseNumber: "",
      logo: "",
      location: {
        coordinates: [0, 0],
      },
      weeklySchedule: {
        monday: { open: "09:00", close: "21:00", isClosed: false },
        tuesday: { open: "09:00", close: "21:00", isClosed: false },
        wednesday: { open: "09:00", close: "21:00", isClosed: false },
        thursday: { open: "09:00", close: "21:00", isClosed: false },
        friday: { open: "09:00", close: "21:00", isClosed: false },
        saturday: { open: "10:00", close: "22:00", isClosed: false },
        sunday: { open: "10:00", close: "22:00", isClosed: false },
      },
      manualOverride: {
        isManuallySet: false,
        isOpen: true,
      },
    },
    validate: {
      restaurantName: (value) => (!value ? "Restaurant name is required" : null),
      address: (value) => (!value ? "Address is required" : null),
      licenseNumber: (value) => (!value ? "License number is required" : null),
  
    },
  });

  useEffect(() => {
    if (restaurant) {
      form.setValues({
        restaurantName: restaurant?.restaurantName || "",
        address: restaurant?.address || "",
        cuisineType: restaurant?.cuisineType || "Other",
        licenseNumber: restaurant?.licenseNumber || "",
        logo: restaurant?.logo || "",
        location: {
          coordinates: restaurant.location?.coordinates || [0, 0],
        },
        weeklySchedule: restaurant.weeklySchedule || {
          monday: { open: "09:00", close: "21:00", isClosed: false },
          tuesday: { open: "09:00", close: "21:00", isClosed: false },
          wednesday: { open: "09:00", close: "21:00", isClosed: false },
          thursday: { open: "09:00", close: "21:00", isClosed: false },
          friday: { open: "09:00", close: "21:00", isClosed: false },
          saturday: { open: "10:00", close: "22:00", isClosed: false },
          sunday: { open: "10:00", close: "22:00", isClosed: false },
        },
        manualOverride: restaurant.manualOverride || {
          isManuallySet: false,
          isOpen: true,
        },
      });
      setSelectedLocation(restaurant.location?.coordinates || null);
    }
  }, [restaurant]);

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setSelectedLocation([lat, lng]);
      form.setFieldValue("location.coordinates", [lng, lat]);
    },
    [form]
  );

  const handleSave = async (values: typeof form.values) => {
    try {
      if (!restaurant?._id) {
        form.setErrors({
          restaurantName: "Restaurant ID is missing. Please ensure you are logged in.",
        });
        notifications.show({
          title: "Error",
          message: "Restaurant ID is missing. Please ensure you are logged in.",
          color: "red",
          icon: <IconX size={16} />,
        });
        return;
      }

      if (!selectedLocation || (selectedLocation[0] === 0 && selectedLocation[1] === 0)) {
        form.setFieldError("location.coordinates", "Please select a location on the map");
        notifications.show({
          title: "Error",
          message: "Please select a valid location on the map.",
          color: "red",
          icon: <IconX size={16} />,
        });
        return;
      }

      const entityData = {
        ...values,
        location: {
          type: "Point",
          coordinates: values.location.coordinates,
        },
      };

      await updateRestaurant({ _id: restaurant._id, entityData:entityData as any});

      notifications.show({
        title: "Profile Updated",
        message: "Your restaurant profile has been updated successfully.",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      setIsEditing(false);
    } catch (error: any) {
      const errMsg =
        error?.response?.data?.error?.message ||
        error?.message ||
        "Unexpected error occurred";
      form.setErrors({
        restaurantName: errMsg,
      });
      console.error("Submission error:", error);
      notifications.show({
        title: "Error",
        message: errMsg,
        color: "red",
        icon: <IconX size={16} />,
      });
    }
  };

  const handleCancel = () => {
    if (restaurant) {
      form.setValues({
        restaurantName: restaurant.restaurantName || "",
        address: restaurant.address || "",
        cuisineType: restaurant.cuisineType || "Other",
        licenseNumber: restaurant.licenseNumber || "",
        logo: restaurant.logo || "",
        location: {
          coordinates: restaurant.location?.coordinates || [0, 0],
        },
        weeklySchedule: restaurant.weeklySchedule || {
          monday: { open: "09:00", close: "21:00", isClosed: false },
          tuesday: { open: "09:00", close: "21:00", isClosed: false },
          wednesday: { open: "09:00", close: "21:00", isClosed: false },
          thursday: { open: "09:00", close: "21:00", isClosed: false },
          friday: { open: "09:00", close: "21:00", isClosed: false },
          saturday: { open: "10:00", close: "22:00", isClosed: false },
          sunday: { open: "10:00", close: "22:00", isClosed: false },
        },
        manualOverride: restaurant.manualOverride || {
          isManuallySet: false,
          isOpen: true,
        },
      });
      setSelectedLocation(restaurant.location?.coordinates || null);
    }
    setIsEditing(false);
    notifications.show({
      title: "Edit Cancelled",
      message: "Your changes were discarded.",
      color: "orange",
      icon: <IconX size={16} />,
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (!restaurant) return <div>No restaurant data found</div>;

  return (
    <Card shadow="sm" padding="xl" style={{ margin: "auto" }}>
      <Group justify="space-between" mb="md">
        <Title order={3}>Profile Information</Title>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          disabled={uploadLoading || updateLoading}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </Group>

      <form onSubmit={form.onSubmit(handleSave)}>
        <Stack gap="md">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Title order={3} mb="md">
                  Basic Information
                </Title>
                <SimpleGrid cols={1} spacing="md">
                  <FormInput
                    required
                    label="Restaurant Name"
                    placeholder="Enter restaurant name"
                    {...form.getInputProps("restaurantName")}
                    disabled={!isEditing || uploadLoading || updateLoading}
                  />
                  <Select
                    required
                    label="Cuisine Type"
                    placeholder="Select cuisine type"
                    data={CuisineType}
                    {...form.getInputProps("cuisineType")}
                    disabled={!isEditing || uploadLoading || updateLoading}
                  />
                  <FormInput
                    required
                    label="License Number"
                    placeholder="Enter license number"
                    {...form.getInputProps("licenseNumber")}
                    disabled={!isEditing || uploadLoading || updateLoading}
                  />
                  <FormInput
                    required
                    label="Address"
                    placeholder="Enter full address"
                    {...form.getInputProps("address")}
                    disabled={!isEditing || uploadLoading || updateLoading}
                  />
                  <FormImageUpload
                    required
                    label="Restaurant Logo"
                    uploadApi={uploadImage}
                    maxSize={5 * 1024 * 1024}
                    {...form.getInputProps("logo")}
                    error={uploadError?.message}
                    disabled={!isEditing || uploadLoading || updateLoading}
                  />
                </SimpleGrid>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Title order={3} mb="xs">
                  Location
                </Title>
                <Text size="sm" c="dimmed" mb="md">
                  Click on the map to select your restaurant's location
                </Text>
                <LocationSelectorMap
                  onLocationSelect={handleLocationSelect}
                  selectedLocation={selectedLocation}
                />
                {selectedLocation && (
                  <Text size="sm" mt="sm" c="green">
                    Selected: {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
                  </Text>
                )}
           
              </Card>
            </Grid.Col>
          </Grid>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Weekly Schedule
            </Title>
            <Stack gap="sm">
              {daysOfWeek.map((day) => {
                type Weekday = keyof typeof form.values.weeklySchedule;
                const weekday = day as Weekday;
                return (
                  <Paper key={day} p="xs" withBorder>
                    <Grid align="center">
                      <Grid.Col span={{ base: 12, sm: 3 }}>
                        <Text fw={500} tt="capitalize">
                          {day}
                        </Text>
                      </Grid.Col>
                      <Grid.Col span={{ base: 12, sm: 2 }}>
                        <Switch
                          label="Closed"
                          {...form.getInputProps(`weeklySchedule.${day}.isClosed`, {
                            type: "checkbox",
                          })}
                          disabled={!isEditing || uploadLoading || updateLoading}
                        />
                      </Grid.Col>
                      {!form.values.weeklySchedule[weekday]?.isClosed && (
                        <>
                          <Grid.Col span={{ base: 6, sm: 3 }}>
                            <TimeInput
                              label="Open"
                              {...form.getInputProps(`weeklySchedule.${day}.open`)}
                              disabled={!isEditing || uploadLoading || updateLoading}
                            />
                          </Grid.Col>
                          <Grid.Col span={{ base: 6, sm: 3 }}>
                            <TimeInput
                              label="Close"
                              {...form.getInputProps(`weeklySchedule.${day}.close`)}
                              disabled={!isEditing || uploadLoading || updateLoading}
                            />
                          </Grid.Col>
                        </>
                      )}
                    </Grid>
                  </Paper>
                );
              })}
            </Stack>
          </Card>

          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">
              Manual Override
            </Title>
            <Group>
              <Switch
                label="Enable Manual Override"
                description="Override automatic schedule"
                {...form.getInputProps("manualOverride.isManuallySet", {
                  type: "checkbox",
                })}
                disabled={!isEditing || uploadLoading || updateLoading}
              />
              {form.values.manualOverride.isManuallySet && (
                <Switch
                  label="Currently Open"
                  description="Set current status"
                  {...form.getInputProps("manualOverride.isOpen", {
                    type: "checkbox",
                  })}
                  disabled={!isEditing || uploadLoading || updateLoading}
                />
              )}
            </Group>
          </Card>

          {isEditing && (
            <>
              <Divider />
              <Group justify="flex-end" mt="md">
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={uploadLoading || updateLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={updateLoading}
                  disabled={uploadLoading || updateLoading}
                >
                  Save
                </Button>
              </Group>
            </>
          )}
        </Stack>
      </form>
    </Card>
  );
};

export default ProfileInfoTab;
