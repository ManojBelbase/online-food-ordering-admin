import React from 'react';
import { Select, MultiSelect } from '@mantine/core';
import { useTheme } from '../../contexts/ThemeContext';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface FormSelectProps {
  label: string;
  placeholder?: string;
  data: SelectOption[] | string[];
  value?: string | string[];
  onChange?: (value: string | string[] | null) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  description?: string;
  withAsterisk?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
  maxDropdownHeight?: number;
  limit?: number; // For MultiSelect
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  className?: string;
  nothingFoundMessage?: string;
  allowDeselect?: boolean;
}

export const FormSelect = React.forwardRef<HTMLInputElement, FormSelectProps>(
  (
    {
      label,
      placeholder,
      data,
      value,
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      readonly = false,
      size = 'md',
      radius = 'sm',
      description,
      withAsterisk,
      searchable = false,
      clearable = false,
      multiple = false,
      maxDropdownHeight = 220,
      limit,
      leftSection,
      rightSection,
      className,
      nothingFoundMessage = 'No options found',
      allowDeselect = true,
      ...other
    },
    ref
  ) => {
    const { theme } = useTheme();

    const commonStyles = {
      label: {
        color: theme.colors.textPrimary,
        fontWeight: 400,
        marginBottom: '4px',
      },
      
      input: {
        backgroundColor: theme.colors.surface,
        borderColor: error ? theme.colors.error : theme.colors.border,
        color: theme.colors.textPrimary,
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
      dropdown: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        boxShadow: theme.shadows.md,
      },
      option: {
        color: theme.colors.textPrimary,
        '&[data-selected]': {
          backgroundColor: theme.colors.primary,
          color: '#ffffff',
        },
        '&[data-hovered]': {
          backgroundColor: `${theme.colors.primary}15`,
          color: theme.colors.textPrimary,
        },
      },
      description: {
        color: theme.colors.textSecondary,
      },
      error: {
        color: theme.colors.error,
      },
    };
    

    const commonProps = {
      label,
      placeholder,
      data,
      value,
      onChange,
      onBlur,
      error,
      required,
      disabled,
      readOnly: readonly,
      size,
      radius,
      description,
      withAsterisk: withAsterisk ?? required,
      searchable,
      clearable,
      maxDropdownHeight,
      leftSection,
      rightSection,
      className,
      nothingFoundMessage,
      allowDeselect,
      styles: commonStyles,
      ...other,
    };

    if (multiple) {
      return (
        <MultiSelect
          {...commonProps}
          value={value as string[]}
          onChange={onChange as (value: string[]) => void}
          limit={limit}
          ref={ref}
        />
      );
    }

    return (
      <Select
        {...commonProps}
        value={value as string}
        onChange={onChange as (value: string | null) => void}
        ref={ref}

      />
    );
  }
);

FormSelect.displayName = 'FormSelect';

// Convenience components
export const FormMultiSelect = React.forwardRef<HTMLInputElement, Omit<FormSelectProps, 'multiple'>>(
  (props, ref) => (
    <FormSelect {...props} multiple={true} ref={ref} />
  )
);

FormMultiSelect.displayName = 'FormMultiSelect';

export const FormCombobox = React.forwardRef<HTMLInputElement, FormSelectProps>(
  (props, ref) => (
    <FormSelect {...props} searchable={true} ref={ref} />
  )
);

FormCombobox.displayName = 'FormCombobox';
