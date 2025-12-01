
import type React from "react"
import { TextInput, PasswordInput, Stack } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconLogin, IconUser, IconLock, IconCheck, IconAlertCircle, IconFaceId } from "@tabler/icons-react"
import { useAppDispatch, useAuth } from "../../redux/useAuth"
import { useTheme } from "../../contexts/ThemeContext"
import { loginUser } from "../../server-action/authSlice"
import { loginValidators } from "../../validation/authValidation"
import { ActionButton } from "../../components/ui"


interface LoginFormValues {
  email: string
  password: string
}

interface CredentialsLoginProps {
  onSuccess: () => void
  onSwitchToFace?: () => void
}

const CredentialsLogin: React.FC<CredentialsLoginProps> = ({ onSuccess, onSwitchToFace }) => {
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { loadingLogin } = useAuth()

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidators,
  })

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const result = await dispatch(loginUser(values))
      if (loginUser.fulfilled.match(result)) {
        notifications.show({
          title: "Welcome Back!",
          message: "Login successful",
          color: "green",
          icon: <IconCheck size={16} />,
        })
        onSuccess()
      } else if (loginUser.rejected.match(result)) {
        const errorMessage = (result.payload as string) || "Invalid credentials";

        notifications.show({
          title: "Login Failed",
          message: errorMessage,
          color: "red",
          icon: <IconAlertCircle size={16} />,
        })
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "An error occurred during login",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      })
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={16}>
        <TextInput
          placeholder="Email address"
          leftSection={<IconUser size={18} style={{ color: theme.colors.textSecondary }} />}
          size="md"
          {...form.getInputProps("email")}
          styles={{
            input: {
              backgroundColor: theme.colors.inputBackground,
              border: `1px solid ${theme.colors.inputBorder}`,
              borderRadius: "8px",
              color: theme.colors.textPrimary,
              fontSize: "14px",
              height: "44px",
              paddingLeft: "40px",
              "&::placeholder": {
                color: theme.colors.textSecondary,
              },
              "&:focus": {
                borderColor: theme.colors.primary,
                boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
                outline: "none",
              },
            },
          }}
        />

        <PasswordInput
          placeholder="Password"
          leftSection={<IconLock size={18} style={{ color: theme.colors.textSecondary }} />}
          size="md"
          {...form.getInputProps("password")}
          styles={{
            input: {
              backgroundColor: theme.colors.inputBackground,
              border: `1px solid ${theme.colors.inputBorder}`,
              borderRadius: "8px",
              color: theme.colors.textPrimary,
              fontSize: "14px",
              height: "44px",
              paddingLeft: "40px",
              "&::placeholder": {
                color: theme.colors.textSecondary,
              },
              "&:focus": {
                borderColor: theme.colors.primary,
                boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
                outline: "none",
              },
            },
            innerInput: {
              paddingRight: "40px",
            },
          }}
        />

        <ActionButton
          type="submit"
          width="100%"
          size="md"
          loading={loadingLogin}
          variant="primary"
          height="44px"
          fontSize="14px"
          fontWeight={600}
          borderRadius="8px"
        >
          <IconLogin size={18} style={{ marginRight: '8px' }} />
          {loadingLogin ? "Signing In..." : "Sign In"}
        </ActionButton>

        {onSwitchToFace && (
          <ActionButton
            variant="ghost"
            onClick={onSwitchToFace}
            size="sm"
            width="100%"
            fontWeight={400}
          >
            <IconFaceId size={16} style={{ marginRight: '8px' }} />
            Use face login instead
          </ActionButton>
        )}

      </Stack>
    </form>
  )
}

export default CredentialsLogin
