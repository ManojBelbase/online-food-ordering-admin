import  { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Button,
  Paper,
  Stack,
  LoadingOverlay,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";
import { useTheme } from "../contexts/ThemeContext";

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        notifications.show({
          title: "Verification Failed",
          message: "Invalid verification link.",
          color: "red",
          icon: <IconAlertCircle size={16} />,
        });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://food-ordering-backend-axbt.onrender.com/api/v1/auth/verify-email?token=${token}`,
          {
            method: "GET",
          }
        );

        if (!res.ok) {
          throw new Error("Verification failed");
        }

        const data = await res.json();

        setSuccess(true);
        notifications.show({
          title: "Email Verified",
          message: data?.message || "Your email has been successfully verified.",
          color: "green",
          icon: <IconCheck size={16} />,
        });
      } catch (error) {
        notifications.show({
          title: "Verification Failed",
          message:
            "We couldn't verify your email. The link might be expired or invalid.",
          color: "red",
          icon: <IconAlertCircle size={16} />,
        });
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Container size={420}>
        <Paper
          radius="md"
          p="xl"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.lg,
            position: "relative",
            textAlign: "center",
          }}
        >
          <LoadingOverlay
            visible={loading}
            overlayProps={{ radius: "sm", blur: 2 }}
          />
          <Stack gap="md">
            <Title
              order={2}
              style={{ color: theme.colors.textPrimary }}
            >
              {success ? "Verification Successful" : "Verifying Email..."}
            </Title>
            {!loading && success && (
              <>
                <Text style={{ color: theme.colors.textSecondary }}>
                  Your account has been successfully verified. You can now use all features.
                </Text>
                <Button
                  onClick={() => navigate("/")}
                  style={{
                    backgroundColor: theme.colors.primary,
                    "&:hover": {
                      backgroundColor: theme.colors.primaryHover,
                    },
                  }}
                >
                  Go to Homepage
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Container>
    </div>
  );
};

export default VerifyEmailPage;
