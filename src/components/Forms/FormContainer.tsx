import React from 'react';
import { Paper, Stack, Group, Title, Divider } from '@mantine/core';
import { IconDeviceFloppy, IconX, IconRefresh } from '@tabler/icons-react';
import { useTheme } from '../../contexts/ThemeContext';
import { CustomText, ActionButton } from '../ui';

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
                <CustomText
                  size="sm"
                  color="secondary"
                >
                  {description}
                </CustomText>
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
                  <ActionButton
                    type="button"
                    variant={resetVariant === 'filled' ? 'secondary' : 'outline'}
                    onClick={onReset}
                    disabled={disabled || loading}
                  >
                    <IconRefresh size={16} style={{ marginRight: '8px' }} />
                    {resetLabel}
                  </ActionButton>
                )}

                {showCancel && (
                  <ActionButton
                    type="button"
                    variant={cancelVariant === 'filled' ? 'error' : 'outline'}
                    onClick={onCancel}
                    disabled={loading}
                  >
                    <IconX size={16} style={{ marginRight: '8px' }} />
                    {cancelLabel}
                  </ActionButton>
                )}

                {showSubmit && (
                  <ActionButton
                    type="submit"
                    variant={submitVariant === 'filled' ? 'primary' : 'outline'}
                    loading={loading}
                    disabled={disabled}
                  >
                    {!loading && <IconDeviceFloppy size={16} style={{ marginRight: '8px' }} />}
                    {submitLabel}
                  </ActionButton>
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
