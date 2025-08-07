import React from 'react';
import { Stack, Group, Title, Divider } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useTheme } from '../../contexts/ThemeContext';
import { CustomText } from '../ui';

// Form Section Component for organizing form fields
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withDivider?: boolean;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  spacing = 'md',
  withDivider = false,
  className,
}) => {
  const { theme } = useTheme();

  return (
    <div className={className}>
      {(title || description) && (
        <Stack gap="xs" mb={spacing}>
          {title && (
            <Title
              order={4}
              style={{ color: theme.colors.textPrimary }}
            >
              {title}
            </Title>
          )}
          {description && (
            <CustomText
              size="sm"
              color="secondary"
            >
              {description}
            </CustomText>
          )}
          {withDivider && (
            <Divider style={{ borderColor: theme.colors.border }} />
          )}
        </Stack>
      )}
      
      <Stack gap={spacing}>
        {children}
      </Stack>
    </div>
  );
};

// Form Row Component for horizontal layouts
interface FormRowProps {
  children: React.ReactNode;
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  className?: string;
  responsive?: boolean; // Enable responsive behavior
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  spacing = 'md',
  align = 'flex-start',
  justify = 'flex-start',
  wrap = 'wrap',
  className,
  responsive = false,
}) => {
  const isMobile = useMediaQuery('(max-width: 480px)');

  return (
    <Group
      gap={responsive && isMobile ? 'sm' : spacing}
      align={align}
      justify={responsive && isMobile ? 'center' : justify}
      wrap={wrap}
      className={className}
    >
      {children}
    </Group>
  );
};
