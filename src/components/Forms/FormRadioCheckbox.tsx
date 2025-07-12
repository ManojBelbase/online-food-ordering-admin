import React from 'react';
import { Radio, Checkbox, Group, Stack, Text } from '@mantine/core';
import { useTheme } from '../../contexts/ThemeContext';

export interface RadioCheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface FormRadioGroupProps {
  label?: string;
  description?: string;
  options: RadioCheckboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withAsterisk?: boolean;
  className?: string;
}

export const FormRadioGroup = React.forwardRef<HTMLDivElement, FormRadioGroupProps>(
  (
    {
      label,
      description,
      options,
      value,
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      size = 'md',
      orientation = 'vertical',
      spacing = 'sm',
      withAsterisk,
      className,
      ...other
    },
    ref
  ) => {
    const { theme } = useTheme();

    const Container = orientation === 'horizontal' ? Group : Stack;

    return (
      <div ref={ref} className={className} {...other}>
        {label && (
          <Text
            size={size}
            fw={500}
            mb="xs"
            style={{ color: theme.colors.textPrimary }}
          >
            {label}
            {(withAsterisk ?? required) && (
              <span style={{ color: theme.colors.error }}> *</span>
            )}
          </Text>
        )}
        
        {description && (
          <Text
            size="sm"
            mb="xs"
            style={{ color: theme.colors.textSecondary }}
          >
            {description}
          </Text>
        )}

        <Radio.Group
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
          styles={{
            error: {
              color: theme.colors.error,
            },
          }}
        >
          <Container gap={spacing}>
            {options.map((option) => (
              <Radio
                key={option.value}
                value={option.value}
                label={option.label}
                description={option.description}
                disabled={disabled || option.disabled}
                size={size}
                styles={{
                  label: {
                    color: theme.colors.textPrimary,
                  },
                  description: {
                    color: theme.colors.textSecondary,
                  },
                  radio: {
                    borderColor: theme.colors.border,
                    '&:checked': {
                      borderColor: theme.colors.primary,
                      backgroundColor: theme.colors.primary,
                    },
                    '&:disabled': {
                      borderColor: theme.colors.textDisabled,
                      backgroundColor: theme.colors.textDisabled,
                    },
                  },
                }}
              />
            ))}
          </Container>
        </Radio.Group>
      </div>
    );
  }
);

FormRadioGroup.displayName = 'FormRadioGroup';

interface FormCheckboxGroupProps {
  label?: string;
  description?: string;
  options: RadioCheckboxOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  withAsterisk?: boolean;
  className?: string;
}

export const FormCheckboxGroup = React.forwardRef<HTMLDivElement, FormCheckboxGroupProps>(
  (
    {
      label,
      description,
      options,
      value = [],
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      size = 'md',
      orientation = 'vertical',
      spacing = 'sm',
      withAsterisk,
      className,
      ...other
    },
    ref
  ) => {
    const { theme } = useTheme();

    const Container = orientation === 'horizontal' ? Group : Stack;

    const handleCheckboxChange = (optionValue: string, checked: boolean) => {
      if (!onChange) return;

      if (checked) {
        onChange([...value, optionValue]);
      } else {
        onChange(value.filter(v => v !== optionValue));
      }
    };

    return (
      <div ref={ref} className={className} {...other}>
        {label && (
          <Text
            size={size}
            fw={500}
            mb="xs"
            style={{ color: theme.colors.textPrimary }}
          >
            {label}
            {(withAsterisk ?? required) && (
              <span style={{ color: theme.colors.error }}> *</span>
            )}
          </Text>
        )}
        
        {description && (
          <Text
            size="sm"
            mb="xs"
            style={{ color: theme.colors.textSecondary }}
          >
            {description}
          </Text>
        )}

        <Container gap={spacing}>
          {options.map((option) => (
            <Checkbox
              key={option.value}
              checked={value.includes(option.value)}
              onChange={(event) => 
                handleCheckboxChange(option.value, event.currentTarget.checked)
              }
              onBlur={onBlur}
              label={option.label}
              description={option.description}
              disabled={disabled || option.disabled}
              size={size}
              styles={{
                label: {
                  color: theme.colors.textPrimary,
                },
                description: {
                  color: theme.colors.textSecondary,
                },
                input: {
                  borderColor: theme.colors.border,
                  '&:checked': {
                    borderColor: theme.colors.primary,
                    backgroundColor: theme.colors.primary,
                  },
                  '&:disabled': {
                    borderColor: theme.colors.textDisabled,
                    backgroundColor: theme.colors.textDisabled,
                  },
                },
              }}
            />
          ))}
        </Container>

        {error && (
          <Text
            size="sm"
            mt="xs"
            style={{ color: theme.colors.error }}
          >
            {error}
          </Text>
        )}
      </div>
    );
  }
);

FormCheckboxGroup.displayName = 'FormCheckboxGroup';

// Single Checkbox Component
interface FormCheckboxProps {
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const FormCheckbox = React.forwardRef<HTMLInputElement, FormCheckboxProps>(
  (
    {
      label,
      description,
      checked = false,
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      size = 'md',
      className,
      ...other
    },
    ref
  ) => {
    const { theme } = useTheme();

    return (
      <div className={className}>
        <Checkbox
          ref={ref}
          checked={checked}
          onChange={(event) => onChange?.(event.currentTarget.checked)}
          onBlur={onBlur}
          label={label}
          description={description}
          disabled={disabled}
          size={size}
          error={error}
          styles={{
            label: {
              color: theme.colors.textPrimary,
            },
            description: {
              color: theme.colors.textSecondary,
            },
            input: {
              borderColor: error ? theme.colors.error : theme.colors.border,
              '&:checked': {
                borderColor: theme.colors.primary,
                backgroundColor: theme.colors.primary,
              },
              '&:disabled': {
                borderColor: theme.colors.textDisabled,
                backgroundColor: theme.colors.textDisabled,
              },
            },
            error: {
              color: theme.colors.error,
            },
          }}
          {...other}
        />
      </div>
    );
  }
);

FormCheckbox.displayName = 'FormCheckbox';
