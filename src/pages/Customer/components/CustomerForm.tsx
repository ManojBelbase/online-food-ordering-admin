import React from "react";
import { Button, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconUserPlus, IconMail, IconLock } from "@tabler/icons-react";
import { useTheme } from "../../../contexts/ThemeContext";
import { FormInput, FormSelect, type SelectOption } from "../../../components/Forms";
import { useAppDispatch } from "../../../redux/useAuth";
import { signupUser, type SignupCredentials } from "../../../server-action/authThunk";
import { customerValidation } from "./CustomerFormValidation";


const CustomerForm: React.FC = () => {
const { theme } = useTheme();
const dispatch = useAppDispatch();

const roleOptions: SelectOption[] = [
  { value: "user", label: "User" },
  { value: "restaurant", label: "Restaurant" },
  { value: "delivery", label: "Delivery" },
];

  const form = useForm<SignupCredentials>({
    initialValues: {
      name:"",
      email: "",
      password: "",
      role: "", 
    },
    validate:customerValidation,
  });

  const handleSubmit = async (values: SignupCredentials) => {
    try {
       await dispatch(signupUser(values));
    } catch (error) {
        
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
          <FormInput
          label="Name"
          type="text"
          placeholder="Enter Name"
          leftSection={<IconMail size={16} />}
          {...form.getInputProps("name")}
          required
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

        <Button
          type="submit"
          fullWidth
          leftSection={<IconUserPlus size={16} />}
          style={{
            backgroundColor: theme.colors.primary,
            "&:hover": {
              backgroundColor: theme.colors.primaryHover,
            },
          }}
        >
          Create Customer
        </Button>
      </Stack>
    </form>
  );
};

export default CustomerForm;
