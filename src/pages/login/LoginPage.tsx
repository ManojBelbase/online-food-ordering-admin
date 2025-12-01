import type React from "react"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Title, LoadingOverlay, Box, Group, Stack } from "@mantine/core"
import { IconFaceId, IconKey, IconShieldCheck } from "@tabler/icons-react"
import { useMediaQuery } from "@mantine/hooks"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../redux/useAuth"
import CredentialsLogin from "./CredentialsLogin"
import FaceLogin from "./FaceLogin"
import { CustomText, ActionButton } from "../../components/ui"

const LoginPage: React.FC = () => {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("credentials")
  const { loadingLogin, isAuthenticated } = useAuth()
  const from = location.state?.from?.pathname || "/"
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleLoginSuccess = () => {
    navigate(from, { replace: true })
  }

  const handleSwitchToCredentials = () => {
    setActiveTab("credentials")
  }

  return (
    <Box
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      <LoadingOverlay visible={loadingLogin} />

      {/* Left Side - Hero Section */}
      <Box
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: isMobile ? "40vh" : "100vh",
        }}
      >

        <Box
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            color: "white",
            maxWidth: "400px",
            padding: "20px",
          }}
        >
          <IconShieldCheck
            size={isMobile ? 48 : 64}
            style={{
              marginBottom: isMobile ? "16px" : "24px",
              opacity: 0.9,
            }}
          />
          <Title
            order={1}
            style={{
              fontSize: isMobile ? "20px" : "30px",
              fontWeight: 600,
              marginBottom: isMobile ? "12px" : "16px",
            }}
          >
            Restaurant Management
          </Title>
          <CustomText
            fontSize={isMobile ? "12px" : "16px"}
            lineHeight={1.6}
            style={{
              opacity: 0.9,
              color: 'white'
            }}
          >
            Secure access to your food ordering system management dashboard
          </CustomText>
        </Box>
      </Box>

      <Box
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.surface,
          padding: isMobile ? "20px" : "40px",
        }}
      >
        <Box
          style={{
            width: "100%",
            maxWidth: isMobile ? "400px" : "450px",
          }}
        >
          <Stack gap={8} mb={24}>
            <Title
              order={2}
              style={{
                fontSize: isMobile ? "20px" : "24px",
                fontWeight: 600,
                color: theme.colors.textPrimary,
              }}
            >
              Welcome Back
            </Title>
            <CustomText size="sm" color="secondary">
              Sign in to your admin account
            </CustomText>
          </Stack>

          <Group gap={8} mb={24} grow>
            <ActionButton
              variant={activeTab === "credentials" ? "primary" : "outline"}
              onClick={() => setActiveTab("credentials")}
              size="sm"
              height="36px"
              fontSize="14px"
              fontWeight={500}
              borderRadius="6px"
            >
              <IconKey size={16} style={{ marginRight: '8px' }} />
              Password
            </ActionButton>
            <ActionButton
              variant={activeTab === "face" ? "primary" : "outline"}
              onClick={() => setActiveTab("face")}
              size="sm"
              height="36px"
              fontSize="14px"
              fontWeight={500}
              borderRadius="6px"
            >
              <IconFaceId size={16} style={{ marginRight: '8px' }} />
              Face ID
            </ActionButton>
          </Group>

          {activeTab === "credentials" ? (
            <CredentialsLogin onSuccess={handleLoginSuccess} />
          ) : (
            <FaceLogin onSwitchToCredentials={handleSwitchToCredentials} />
          )}

          <Box mt={24} style={{ textAlign: "center" }}>
            <CustomText size="xs" color="secondary">
              Secure authentication • Food Ordering System
            </CustomText>
          </Box>
          <Box style={{ textAlign: "center", color: theme.colors.error }} mt={16}>
            <CustomText size="xs" color="warning" mt={12} c={"blue"}>
              Test Account(Admin) - Email: thisisme2077@gmail.com | Password: manoj123
            </CustomText>

            <CustomText size="xs" c="yellow">
              Test Account(Restaurant) - Email: manojbelbase56@gmail.com | Password: 12345678
            </CustomText>
          </Box>


        </Box>
      </Box>
    </Box>
  )
}

export default LoginPage