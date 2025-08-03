import React, { useState, useEffect } from 'react';
import { Badge, Group, ActionIcon, Tooltip, Loader } from '@mantine/core';
import { IconMail, IconMailCheck, IconMailX, IconClock } from '@tabler/icons-react';
import { emailVerificationApi, type EmailVerificationStatus } from '../server-action/api/emailVerification';

interface EmailVerificationStatusProps {
  email: string;
  isEmailVerified?: boolean;
  onResendClick?: () => void;
  showResendButton?: boolean;
}

const EmailVerificationStatusComponent: React.FC<EmailVerificationStatusProps> = ({
  email,
  isEmailVerified,
  onResendClick,
  showResendButton = true
}) => {
  const [status, setStatus] = useState<EmailVerificationStatus | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (!email) return;
      
      setLoading(true);
      try {
        const statusData = await emailVerificationApi.checkEmailVerificationStatus(email);
        setStatus(statusData);
      } catch (error: any) {
        // Handle 404 errors silently (user not found or verification not needed)
        if (error?.response?.status === 404) {
          setStatus({
            email,
            isEmailVerified: isEmailVerified || false,
            isTokenExpired: false,
            canResendVerification: !isEmailVerified
          });
        } else {
          // Log other errors for debugging
          console.error('Error checking email verification status:', error);
          setStatus({
            email,
            isEmailVerified: isEmailVerified || false,
            isTokenExpired: false,
            canResendVerification: !isEmailVerified
          });
        }
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [email, isEmailVerified]);

  if (loading) {
    return (
      <Group gap="xs">
        <Loader size="xs" />
        <Badge variant="light" color="gray">
          Checking...
        </Badge>
      </Group>
    );
  }

  if (!status) {
    return (
      <Badge variant="light" color="gray">
        Unknown
      </Badge>
    );
  }

  const getBadgeProps = () => {
    if (status.isEmailVerified) {
      return {
        color: "green",
        leftSection: <IconMailCheck size={12} />,
        children: "Verified"
      };
    }

    if (status.isTokenExpired) {
      return {
        color: "red",
        leftSection: <IconClock size={12} />,
        children: "Expired"
      };
    }

    return {
      color: "orange",
      leftSection: <IconMail size={12} />,
      children: "Pending"
    };
  };

  const badgeProps = getBadgeProps();

  return (
    <Group gap="xs">
      <Badge variant="light" {...badgeProps} />
      
      {showResendButton && status.canResendVerification && onResendClick && (
        <Tooltip 
          label={status.isTokenExpired ? "Token expired - resend verification email" : "Resend verification email"}
        >
          <ActionIcon 
            variant="light" 
            color={status.isTokenExpired ? "red" : "blue"}
            size="sm"
            onClick={onResendClick}
          >
            {status.isTokenExpired ? <IconMailX size={14} /> : <IconMail size={14} />}
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
  );
};

export default EmailVerificationStatusComponent;
