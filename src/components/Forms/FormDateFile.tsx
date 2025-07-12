import React from 'react';
import { FileInput, Switch, Slider } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar, IconUpload } from '@tabler/icons-react';
import { useTheme } from '../../contexts/ThemeContext';
import type {
  FormDatePickerProps,
  FormFileInputProps,
  FormSliderProps,
  FormSwitchProps,
} from '../../types/form';

// ✅ FormDatePicker
export const FormDatePicker = React.forwardRef<HTMLButtonElement, FormDatePickerProps>(
  (
    {
      label,
      placeholder,
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
      minDate,
      maxDate,
      clearable = true,
      leftSection,
      rightSection,
      className,
      ...other
    },
    ref
  ) => {
    const { theme } = useTheme();

    return (
      <DatePickerInput
        ref={ref}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(value) => onChange?.(value ? new Date(value) : null)}
        onBlur={onBlur}
        error={error}
        required={required}
        disabled={disabled}
        readOnly={readonly}
        size={size}
        radius={radius}
        description={description}
        withAsterisk={withAsterisk ?? required}
        minDate={minDate}
        maxDate={maxDate}
        clearable={clearable}
        leftSection={leftSection || <IconCalendar size={16} />}
        rightSection={rightSection}
        className={className}
        styles={{
          label: {
            color: theme.colors.textPrimary,
            fontWeight: 500,
            marginBottom: '8px',
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
  }
);
FormDatePicker.displayName = 'FormDatePicker';

// ✅ FormFileInput
export const FormFileInput = React.forwardRef<HTMLButtonElement, FormFileInputProps>(
  (
    {
      label,
      placeholder = 'Choose file(s)',
      value,
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      size = 'md',
      radius = 'sm',
      description,
      withAsterisk,
      accept,
      multiple = false,
      clearable = true,
      leftSection,
      rightSection,
      className,
      ...other
    },
    ref
  ) => {
    const { theme } = useTheme();

    return (
      <FileInput
        ref={ref}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        required={required}
        disabled={disabled}
        size={size}
        radius={radius}
        description={description}
        withAsterisk={withAsterisk ?? required}
        accept={accept}
        multiple={multiple}
        clearable={clearable}
        leftSection={leftSection || <IconUpload size={16} />}
        rightSection={rightSection}
        className={className}
        styles={{
          label: {
            color: theme.colors.textPrimary,
            fontWeight: 500,
            marginBottom: '8px',
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
  }
);
FormFileInput.displayName = 'FormFileInput';

// ✅ FormSwitch
export const FormSwitch = React.forwardRef<HTMLInputElement, FormSwitchProps>(
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
      onLabel,
      offLabel,
      className,
      ...other
    },
    ref
  ) => {
    const { theme } = useTheme();

    return (
      <div className={className}>
        <Switch
          ref={ref}
          checked={checked}
          onChange={(event) => onChange?.(event.currentTarget.checked)}
          onBlur={onBlur}
          label={label}
          description={description}
          disabled={disabled}
          size={size}
          onLabel={onLabel}
          offLabel={offLabel}
          error={error}
          styles={{
            label: {
              color: theme.colors.textPrimary,
            },
            description: {
              color: theme.colors.textSecondary,
            },
            track: {
              borderColor: theme.colors.border,
              '&[data-checked]': {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
              },
            },
            thumb: {
              backgroundColor: '#ffffff',
              borderColor: theme.colors.border,
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
FormSwitch.displayName = 'FormSwitch';

// ✅ FormSlider
export const FormSlider = React.forwardRef<HTMLDivElement, FormSliderProps>(
  (
    {
      label,
      description,
      value = 0,
      onChange,
      onBlur,
      error,
      required = false,
      disabled = false,
      size = 'md',
      min = 0,
      max = 100,
      step = 1,
      marks,
      showLabelOnHover = true,
      className,
      ...other
    },
    ref
  ) => {
    const { theme } = useTheme();

    return (
      <div ref={ref} className={className}>
        {label && (
          <div style={{ color: theme.colors.textPrimary, fontWeight: 500, marginBottom: '8px' }}>
            {label}
          </div>
        )}
        {description && (
          <div style={{ color: theme.colors.textSecondary, marginBottom: '8px' }}>
            {description}
          </div>
        )}
        <Slider
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          size={size}
          min={min}
          max={max}
          step={step}
          marks={marks}
          showLabelOnHover={showLabelOnHover}
          styles={{
            track: {
              backgroundColor: theme.colors.border,
            },
            bar: {
              backgroundColor: theme.colors.primary,
            },
            thumb: {
              backgroundColor: theme.colors.primary,
              borderColor: theme.colors.primary,
            },
            mark: {
              backgroundColor: theme.colors.border,
            },
            markLabel: {
              color: theme.colors.textSecondary,
            },
          }}
          {...other}
        />
        {error && (
          <div style={{ color: theme.colors.error, fontSize: '14px', marginTop: '4px' }}>
            {error}
          </div>
        )}
      </div>
    );
  }
);
FormSlider.displayName = 'FormSlider';
