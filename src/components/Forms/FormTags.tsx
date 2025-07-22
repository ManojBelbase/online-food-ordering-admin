import React from 'react';
import { MultiSelect } from '@mantine/core';
import { useTheme } from '../../contexts/ThemeContext';

interface FormTagsProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  description?: string;
  withAsterisk?: boolean;
  className?: string;
}

export const FormTags: React.FC<FormTagsProps> = ({
  label,
  placeholder = 'Enter tags (press Enter or Space to add)',
  required = false,
  error,
  value = [],
  onChange,
  onBlur,
  disabled = false,
  readonly = false,
  size = 'sm',
  radius = 'sm',
  description,
  withAsterisk,
  className,
  ...other
}) => {
  const { theme } = useTheme();

  return (
    <MultiSelect
      label={label}
      placeholder={placeholder}
        required={required}
        error={error}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled || readonly}
        size={size}
        radius={radius}
        description={description}
        withAsterisk={withAsterisk ?? required}
        className={className}
        data={[]} // Empty data to disable dropdown
        searchable
        onKeyDown={(event) => {
          if (event.key === ' ' && event.currentTarget.value.trim()) {
            event.preventDefault(); // Prevent space from being added to input
            const newTag = event.currentTarget.value.trim();
            if (newTag && !value.includes(newTag)) {
              onChange?.([...value, newTag]);
              event.currentTarget.value = ''; // Clear input after adding tag
            }
          }
        }}
        styles={{
          pill: {
            backgroundColor: theme.colors.surface,
            border: `1px solid ${theme.colors.primary}`,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            position: 'relative',
            '&:after': {
              content: '"•"', 
              color: theme.colors.primary,
              fontSize: '8px',
              position: 'absolute',
              right: '4px',
              top: '50%',
              transform: 'translateY(-50%)',
            },
            '&:hover': {
              backgroundColor: theme.colors.background,
            },
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
          },
          label: {
            color: theme.colors.textPrimary,
            fontWeight: 400,
            marginBottom: '4px',
          },
          description: {
            color: theme.colors.textSecondary,
          },
          error: {
            color: theme.colors.error,
          },
        }}
        {...other}
      />
    );
};

FormTags.displayName = 'FormTags';