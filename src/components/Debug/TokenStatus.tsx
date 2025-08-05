import React from 'react';
import { Badge, Group, Text, Paper } from '@mantine/core';
import { useTokenValidation } from '../../hooks/useTokenValidation';
import { useAuth } from '../../redux/useAuth';

/**
 * Debug component to show token status - only visible in development
 */
const TokenStatus: React.FC = () => {
  const { accessToken } = useAuth();
  const tokenStatus = useTokenValidation();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  if (!accessToken) {
    return (
      <Paper p="xs" style={{ position: 'fixed', top: 90, right: 100, zIndex: 1000 }}>
        <Badge color="red" size="sm">No Token</Badge>
      </Paper>
    );
  }

  return (
    <Paper p="xs" style={{ position: 'fixed', top: 10, right: 10, zIndex: 1000 }}>
      <Group gap="xs">
        <Badge 
          color={tokenStatus.isValid ? 'green' : 'red'} 
          size="sm"
        >
          {tokenStatus.isValid ? 'Valid' : 'Invalid'}
        </Badge>
        {tokenStatus.isValid && (
          <Text size="xs">
            {tokenStatus.remainingTime.hours > 0 
              ? `${tokenStatus.remainingTime.hours}h ${tokenStatus.remainingTime.minutes % 60}m`
              : `${tokenStatus.remainingTime.minutes}m`
            } left
          </Text>
        )}
      </Group>
    </Paper>
  );
};

export default TokenStatus;
