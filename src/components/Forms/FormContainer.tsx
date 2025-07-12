import React from 'react';
import { Paper, Stack, Group, Button, Title, Text, Divider } from '@mantine/core';
import { IconDeviceFloppy, IconX, IconRefresh } from '@tabler/icons-react';
import { useTheme } from '../../contexts/ThemeContext';

interface FormContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent) => void;
  onReset?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  disabled?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;
  showSubmit?: boolean;
  showCancel?: boolean;
  showReset?: boolean;
  submitVariant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default';
  cancelVariant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default';
  resetVariant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withPaper?: boolean;
  paperProps?: any;
  className?: string;
}

export const FormContainer = React.forwardRef<HTMLFormElement, FormContainerProps>(
  (
    {
      title,
      description,
      children,
      onSubmit,
      onReset,
      onCancel,
      loading = false,
      disabled = false,
      submitLabel = 'Save',
      cancelLabel = 'Cancel',
      resetLabel = 'Reset',
      showSubmit = true,
      showCancel = false,
      showReset = false,
      submitVariant = 'filled',
      cancelVariant = 'outline',
      resetVariant = 'light',
      spacing = 'md',
      withPaper = true,
      paperProps = {},
      className,
      ...other
    },
    ref
  ) => {
    const { theme } = useTheme();

    const formContent = (
      <form ref={ref} onSubmit={onSubmit} className={className} {...other}>
        <Stack gap={spacing}>
          {/* Form Header */}
          {(title || description) && (
            <>
              {title && (
                <Title
                  order={3}
                  style={{ color: theme.colors.textPrimary }}
                >
                  {title}
                </Title>
              )}
              {description && (
                <Text
                  size="sm"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {description}
                </Text>
              )}
              <Divider style={{ borderColor: theme.colors.border }} />
            </>
          )}

          {/* Form Fields */}
          <Stack gap={spacing}>
            {children}
          </Stack>

          {/* Form Actions */}
          {(showSubmit || showCancel || showReset) && (
            <>
              <Divider style={{ borderColor: theme.colors.border }} />
              <Group justify="flex-end" gap="sm">
                {showReset && (
                  <Button
                    type="button"
                    variant={resetVariant}
                    onClick={onReset}
                    disabled={disabled || loading}
                    leftSection={<IconRefresh size={16} />}
                    styles={{
                      root: {
                        backgroundColor: resetVariant === 'filled' ? theme.colors.secondary : 'transparent',
                        borderColor: theme.colors.border,
                        color: resetVariant === 'filled' ? '#ffffff' : theme.colors.textPrimary,
                        '&:hover': {
                          backgroundColor: resetVariant === 'filled' 
                            ? theme.colors.secondaryHover 
                            : `${theme.colors.secondary}15`,
                        },
                      },
                    }}
                  >
                    {resetLabel}
                  </Button>
                )}

                {showCancel && (
                  <Button
                    type="button"
                    variant={cancelVariant}
                    onClick={onCancel}
                    disabled={loading}
                    leftSection={<IconX size={16} />}
                    styles={{
                      root: {
                        backgroundColor: cancelVariant === 'filled' ? theme.colors.error : 'transparent',
                        borderColor: theme.colors.error,
                        color: cancelVariant === 'filled' ? '#ffffff' : theme.colors.error,
                        '&:hover': {
                          backgroundColor: cancelVariant === 'filled'
                            ? theme.colors.error
                            : `${theme.colors.error}15`,
                        },
                      },
                    }}
                  >
                    {cancelLabel}
                  </Button>
                )}

                {showSubmit && (
                  <Button
                    type="submit"
                    variant={submitVariant}
                    loading={loading}
                    disabled={disabled}
                    leftSection={!loading ? <IconDeviceFloppy size={16} /> : undefined}
                    styles={{
                      root: {
                        backgroundColor: submitVariant === 'filled' ? theme.colors.primary : 'transparent',
                        borderColor: theme.colors.primary,
                        color: submitVariant === 'filled' ? '#ffffff' : theme.colors.primary,
                        '&:hover': {
                          backgroundColor: submitVariant === 'filled' 
                            ? theme.colors.primaryHover 
                            : `${theme.colors.primary}15`,
                        },
                        '&:disabled': {
                          backgroundColor: theme.colors.background,
                          borderColor: theme.colors.border,
                          color: theme.colors.textSecondary,
                        },
                      },
                    }}
                  >
                    {submitLabel}
                  </Button>
                )}
              </Group>
            </>
          )}
        </Stack>
      </form>
    );

    if (withPaper) {
      return (
        <Paper
          p="xl"
          radius="md"
          style={{
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.border}`,
            boxShadow: theme.shadows.sm,
          }}
          {...paperProps}
        >
          {formContent}
        </Paper>
      );
    }

    return formContent;
  }
);

FormContainer.displayName = 'FormContainer';

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
            <Text
              size="sm"
              style={{ color: theme.colors.textSecondary }}
            >
              {description}
            </Text>
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
}

export const FormRow: React.FC<FormRowProps> = ({
  children,
  spacing = 'md',
  align = 'flex-start',
  justify = 'flex-start',
  wrap = 'wrap',
  className,
}) => {
  return (
    <Group
      gap={spacing}
      align={align}
      justify={justify}
      wrap={wrap}
      className={className}
    >
      {children}
    </Group>
  );
};
