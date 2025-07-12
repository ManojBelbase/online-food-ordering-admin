// 🎯 Form Components Index - Central export point for all form components

// Input Components
export { FormInput } from './FormInput';

// Select Components
export { FormSelect, FormMultiSelect, FormCombobox } from './FormSelect';
export type { SelectOption } from './FormSelect';

// Radio & Checkbox Components
export { 
  FormRadioGroup, 
  FormCheckboxGroup, 
  FormCheckbox 
} from './FormRadioCheckbox';
export type { RadioCheckboxOption } from './FormRadioCheckbox';

// Date & File Components
export {
  FormDatePicker,
  FormFileInput,
  FormSwitch,
  FormSlider
} from './FormDateFile';

// Image Upload Components
export { FormImageUpload } from './FormImageUpload';

// Container Components
export { 
  FormContainer, 
  FormSection, 
  FormRow 
} from './FormContainer';

// 🚀 Re-export common types for convenience
export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  description?: string;
  withAsterisk?: boolean;
  className?: string;
}

// 🎯 Form validation helpers
export const formValidation = {
  required: (value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required';
    }
    return null;
  },
  
  email: (value: string) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email address';
  },
  
  minLength: (min: number) => (value: string) => {
    if (!value) return null;
    return value.length >= min ? null : `Must be at least ${min} characters`;
  },
  
  maxLength: (max: number) => (value: string) => {
    if (!value) return null;
    return value.length <= max ? null : `Must be no more than ${max} characters`;
  },
  
  minValue: (min: number) => (value: number) => {
    if (value === null || value === undefined) return null;
    return value >= min ? null : `Must be at least ${min}`;
  },
  
  maxValue: (max: number) => (value: number) => {
    if (value === null || value === undefined) return null;
    return value <= max ? null : `Must be no more than ${max}`;
  },
  
  phone: (value: string) => {
    if (!value) return null;
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(value.replace(/\s/g, '')) ? null : 'Please enter a valid phone number';
  },
  
  url: (value: string) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },
  
  password: (value: string) => {
    if (!value) return null;
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])/.test(value)) return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(value)) return 'Password must contain at least one number';
    return null;
  },
  
  confirmPassword: (password: string) => (confirmPassword: string) => {
    if (!confirmPassword) return null;
    return password === confirmPassword ? null : 'Passwords do not match';
  },
};

// 🎯 Form utilities
export const formUtils = {
  // Combine multiple validators
  combine: (...validators: Array<(value: any) => string | null>) => (value: any) => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  },
  
  // Format form data for API submission
  formatForSubmission: (data: Record<string, any>) => {
    const formatted = { ...data };
    
    // Convert empty strings to null
    Object.keys(formatted).forEach(key => {
      if (formatted[key] === '') {
        formatted[key] = null;
      }
    });
    
    return formatted;
  },
  
  // Reset form to initial values
  resetForm: (initialValues: Record<string, any>) => {
    return { ...initialValues };
  },
  
  // Check if form has changes
  hasChanges: (currentValues: Record<string, any>, initialValues: Record<string, any>) => {
    return JSON.stringify(currentValues) !== JSON.stringify(initialValues);
  },
};

// 🎯 Common form configurations
export const formConfigs = {
  sizes: {
    xs: 'xs',
    sm: 'sm', 
    md: 'md',
    lg: 'lg',
    xl: 'xl',
  } as const,
  
  spacing: {
    xs: 'xs',
    sm: 'sm',
    md: 'md', 
    lg: 'lg',
    xl: 'xl',
  } as const,
  
  variants: {
    filled: 'filled',
    outline: 'outline',
    light: 'light',
    subtle: 'subtle',
    default: 'default',
  } as const,
};
