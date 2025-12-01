import React from "react";
import { Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconUserPlus, IconMail, IconLock, IconCheck, IconX } from "@tabler/icons-react";
import { FormInput, FormSelect, type SelectOption } from "../../../components/Forms";
import { useAppDispatch } from "../../../redux/useAuth";
import { signupUser, type SignupCredentials } from "../../../server-action/authSlice";
import { customerValidation } from "./CustomerFormValidation";
import { ActionButton } from "../../../components/ui";

interface CustomerFormProps {
  onSuccess?: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSuccess }) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const roleOptions: SelectOption[] = [
    { value: "user", label: "User" },
    { value: "restaurant", label: "Restaurant" },
    { value: "delivery", label: "Delivery" },
  ];

  const form = useForm<SignupCredentials>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validate: customerValidation,
  });

  const handleSubmit = async (values: SignupCredentials) => {
    setIsSubmitting(true);
    try {
      const result = await dispatch(signupUser(values));

      if (signupUser.fulfilled.match(result)) {
        // Success case
        notifications.show({
          title: "Success!",
          message: `Customer "${values.name}" created successfully`,
          color: "green",
          icon: <IconCheck size={16} />,
          autoClose: 3000,
        });

        // Reset form
        form.reset();

        // Close modal if callback provided
        if (onSuccess) {
          onSuccess();
        }
      } else if (signupUser.rejected.match(result)) {
        // Error case
        const errorMessage = (result.payload as string) || "Failed to create customer";
        notifications.show({
          title: "Error",
          message: errorMessage,
          color: "red",
          icon: <IconX size={16} />,
          autoClose: 5000,
        });
      }
    } catch (error) {
      // Unexpected error
      notifications.show({
        title: "Error",
        message: "An unexpected error occurred",
        color: "red",
        icon: <IconX size={16} />,
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <FormInput
          label="Name"
          type="text"
          placeholder="Enter Name"
          leftSection={<IconUserPlus size={16} />}
          {...form.getInputProps("name")}

        />
        <FormInput
          label="Email"
          type="email"
          placeholder="Enter email"
          leftSection={<IconMail size={16} />}
          {...form.getInputProps("email")}
          required
        />

        <FormInput
          label="Password"
          type="password"
          placeholder="Enter password"
          leftSection={<IconLock size={16} />}
          {...form.getInputProps("password")}
        />

        <FormSelect
          label="Role"
          placeholder="Select Role"
          data={roleOptions}
          leftSection={<IconUserPlus size={16} />}
          {...form.getInputProps("role")}

        />

        <ActionButton
          type="submit"
          width="100%"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Customer..." : "Create Customer"}
        </ActionButton>
      </Stack>
    </form>
  );
};

export default CustomerForm;
