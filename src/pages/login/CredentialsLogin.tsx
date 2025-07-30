"use client"

import type React from "react"
import { TextInput, PasswordInput, Button, Stack, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconLogin, IconUser, IconLock, IconCheck, IconAlertCircle } from "@tabler/icons-react"
import { useAppDispatch, useAuth } from "../../redux/useAuth"
import { useTheme } from "../../contexts/ThemeContext"
import { loginUser } from "../../server-action/authSlice"
import { loginValidators } from "../../validation/authValidation"


interface LoginFormValues {
  email: string
  password: string
}

interface CredentialsLoginProps {
  onSuccess: () => void
}

const CredentialsLogin: React.FC<CredentialsLoginProps> = ({ onSuccess }) => {
  const { theme } = useTheme()
  const dispatch = useAppDispatch()
  const { loadingLogin, errorLogin } = useAuth()

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
        notifications.show({
          title: "Login Failed",
          message: (result.payload as string) || "Invalid credentials",
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

        <Button
          type="submit"
          fullWidth
          size="md"
          loading={loadingLogin}
          leftSection={!loadingLogin ? <IconLogin size={18} /> : undefined}
          styles={{
            root: {
              backgroundColor: theme.colors.primary,
              border: "none",
              borderRadius: "8px",
              height: "44px",
              fontSize: "14px",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: theme.colors.primaryHover,
              },
            },
          }}
        >
          {loadingLogin ? "Signing In..." : "Sign In"}
        </Button>

        {errorLogin && (
          <Text
            size="sm"
            c="red" 

            ta="center"
            p="xs"
            style={{
              backgroundColor: theme.colors.error,
              borderRadius: "6px",
              border: `1px solid ${theme.colors.error}`,
            }}
          >
            {errorLogin}
          </Text>
        )}

      </Stack>
    </form>
  )
}

export default CredentialsLogin
