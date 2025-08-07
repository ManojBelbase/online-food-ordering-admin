import React from 'react';
import { TextInput, PasswordInput, NumberInput, Textarea, Switch } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useTheme } from '../../contexts/ThemeContext';

interface FormInputProps {
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | "toggle";
  required?: boolean;
  error?: string;
  value?: string | number ;
  onChange?: (value: string | number) => void;
  onBlur?: () => void;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  description?: string;
  rows?: number; // For textarea
  maxLength?: number;
  minLength?: number;
  min?: number; // For number input
  max?: number; // For number input
  step?: number; // For number input
  withAsterisk?: boolean;
  className?: string;
  responsive?: boolean; // Enable responsive sizing
}

export const FormInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
  (
    {
      label,
      placeholder,
      type = 'text',
      required = false,
      error,
      value,
      onChange,
      onBlur,
      disabled = false,
      readonly = false,
      size = 'sm',
      radius = 'sm',
      leftSection,
      rightSection,
      description,
      rows = 4,
      maxLength,
      minLength,
      min,
      max,
      step,
      withAsterisk,
      className,
      responsive = false,
      ...other
    },
    ref
  ) => {
    const { theme } = useTheme();

    // Responsive breakpoints
    const isMobile = useMediaQuery('(max-width: 480px)');
    const isTablet = useMediaQuery('(max-width: 768px)');

    // Handle onChange for different input types
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event.currentTarget.value);
    };

    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event.currentTarget.value);
    };

    const handleNumberChange = (value: string | number) => {
      onChange?.(value);
    };

    // Get responsive size
    const getResponsiveSize = () => {
      if (!responsive) return size;
      return isMobile ? 'xs' : isTablet ? 'sm' : size;
    };

    const commonProps = {
      label,
      placeholder,
      required,
      error,
      value,
      onBlur,
      disabled,
      readOnly: readonly,
      size: getResponsiveSize(),
      radius,
      leftSection,
      rightSection,
      description,
      withAsterisk: withAsterisk ?? required,
      className,
      styles: {
        label: {
          color: theme.colors.textPrimary,
          fontWeight: 400,
          marginBottom: isMobile ? '2px' : '4px',
          fontSize: responsive ? (isMobile ? '12px' : isTablet ? '13px' : '14px') : undefined,
        },
        input: {
          backgroundColor: theme.colors.surface,
          borderColor: error ? theme.colors.error : theme.colors.border,
          color: theme.colors.textPrimary,
          fontSize: responsive ? (isMobile ? '12px' : isTablet ? '13px' : '14px') : undefined,
          padding: responsive ? (isMobile ? '6px 8px' : isTablet ? '8px 10px' : undefined) : undefined,
          '&:focus': {
            borderColor: theme.colors.primary,
            boxShadow: `0 0 0 1px ${theme.colors.primary}`,
          },
          '&:disabled': {
            backgroundColor: theme.colors.background,
            color: theme.colors.textSecondary,
          },
          '&[readonly]': {
            backgroundColor: theme.colors.background,
            color: theme.colors.textSecondary,
          },
        },
        description: {
          color: theme.colors.textSecondary,
          fontSize: responsive ? (isMobile ? '11px' : isTablet ? '12px' : '13px') : undefined,
        },
        error: {
          color: theme.colors.error,
          fontSize: responsive ? (isMobile ? '11px' : isTablet ? '12px' : '13px') : undefined,
        },
      },
      ...other,
    };

    switch (type) {
      case 'password':
        return (
          <PasswordInput
            {...commonProps}
            onChange={handleTextChange}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        );

      case 'number':
        return (
          <NumberInput
            {...commonProps}
            min={min}
            max={max}
            step={step}
            onChange={handleNumberChange}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            rows={rows}
            maxLength={maxLength}
            minLength={minLength}
            onChange={handleTextareaChange}
            ref={ref as React.Ref<HTMLTextAreaElement>}
          />
        );

      case 'email':
        return (
          <TextInput
            {...commonProps}
            type="email"
            onChange={handleTextChange}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        );
        case 'toggle':
        return (
          <Switch
            label={label}
            type='toggle'
            checked={!!value}
            onChange={(event) => onChange?.(event?.currentTarget?.checked as any)}
            disabled={disabled}
            readOnly={readonly}
            size={size}
            radius={radius}
            description={description}
            color={theme.colors.primary}
            styles={{
              label: {
                color: theme.colors.textPrimary,
                fontWeight: 500,
                marginBottom: 8,
              },
              description: {
                color: theme.colors.textSecondary,
              },
            }}
            className={className}
            {...other}
          />
        );

      default:
        return (
          <TextInput
            {...commonProps}
            type={type}
            maxLength={maxLength}
            minLength={minLength}
            onChange={handleTextChange}
            ref={ref as React.Ref<HTMLInputElement>}
          />
        );
    }
  }
);

FormInput.displayName = 'FormInput';
