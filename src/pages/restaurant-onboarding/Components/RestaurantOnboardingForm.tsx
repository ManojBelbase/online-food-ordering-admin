import type React from "react";
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
  Container,
  Paper,
  Grid,
} from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useAuth } from "../../../redux/useAuth";
import { useState, useCallback } from "react";
import "leaflet/dist/leaflet.css";
import { FormImageUpload, FormInput } from "../../../components/Forms";
import { CuisineType } from "../../../constants/cuisine-type";
import { useCloudinaryUpload } from "../../../hooks/useCloudinaryUpload";
import { restaurantApi } from "../../../server-action/api/restaurant";
import LocationSelectorMap from "../../../components/LocationSelectorMap";
import { Navigate } from "react-router-dom";
const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const RestaurantOnboardingForm: React.FC = () => {
  const { user } = useAuth();
  const { uploadImage, error: uploadError } = useCloudinaryUpload();
  const {mutateAsync:createRestaurant}= restaurantApi.useCreate();
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
      logo: (value) => (!value ? "Logo is required" : null),
    },
  });

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setSelectedLocation([lat, lng]);
      form.setFieldValue("location.coordinates", [lng, lat]);
    },
    [form]
  );

const handleSubmit = async (values: typeof form.values) => {
  try {
    if (!selectedLocation) {
      form.setFieldError("location", "Please select a location on the map");
      return;
    }

    if (!user?.id) {
      form.setFieldError("restaurantName", "User ID is missing. Please log in again.");
      return;
    }

    const entityData = {
      ...values,
      userId: user.id,
      location: {
        type: "Point",
        coordinates: values.location.coordinates,
      },
    };

  await createRestaurant(entityData as any);
  <Navigate to={'/'}/>
  } catch (error) {
    console.error("Restaurant creation failed", error);
  }
};


  return (
    <Container size="xl" style={{marginBlock:"20px"}}>
      <Paper shadow="sm" p="xl" radius="md">
       <form onSubmit={form.onSubmit(handleSubmit)}>
  <Stack gap="xl">
    <Title order={2} ta="center" c="blue">
      Restaurant Onboarding
    </Title>

    <Grid>
      {/* LEFT: Basic Info */}
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
            />

            <Select
              required
              label="Cuisine Type"
              placeholder="Select cuisine type"
              data={CuisineType}
              {...form.getInputProps("cuisineType")}
            />

            <FormInput
              required
              label="License Number"
              placeholder="Enter license number"
              {...form.getInputProps("licenseNumber")}
            />

            <FormInput
              required
              label="Address"
              placeholder="Enter full address"
              {...form.getInputProps("address")}
            />

            <FormImageUpload
              required
              label="Restaurant Logo"
              uploadApi={uploadImage}
              maxSize={5 * 1024 * 1024}
              {...form.getInputProps("logo")}
              error={uploadError?.message}
            />
          </SimpleGrid>
        </Card>
      </Grid.Col>

      {/* RIGHT: Map Selector */}
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
          {form.errors.location && (
            <Text size="sm" c="red" mt="xs">
              {form.errors.location}
            </Text>
          )}
        </Card>
      </Grid.Col>
    </Grid>

    {/* Weekly Schedule */}
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
                  />
                </Grid.Col>

                {!form.values.weeklySchedule[weekday]?.isClosed && (
                  <>
                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <TimeInput
                        label="Open"
                        {...form.getInputProps(`weeklySchedule.${day}.open`)}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, sm: 3 }}>
                      <TimeInput
                        label="Close"
                        {...form.getInputProps(`weeklySchedule.${day}.close`)}
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

    {/* Manual Override */}
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
        />

        {form.values.manualOverride.isManuallySet && (
          <Switch
            label="Currently Open"
            description="Set current status"
            {...form.getInputProps("manualOverride.isOpen", {
              type: "checkbox",
            })}
          />
        )}
      </Group>
    </Card>

    <Divider />

    <Group justify="flex-end">
      <Button type="submit" loading={form.submitting}>
        Create Restaurant
      </Button>
    </Group>
  </Stack>
</form>

      </Paper>
    </Container>
  );
};

export default RestaurantOnboardingForm;
