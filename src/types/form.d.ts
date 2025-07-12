export interface FormDatePickerProps {
  label: string;
  placeholder?: string;
  value?: Date | null;
  onChange: (value: Date | null) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  description?: string;
  withAsterisk?: boolean;
  minDate?: Date;
  maxDate?: Date;
  clearable?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  className?: string;
}

export interface FormFileInputProps {
  label: string;
  placeholder?: string;
  value?: File | File[] | null;
  onChange?: (value: File | File[] | null) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  description?: string;
  withAsterisk?: boolean;
  accept?: string;
  multiple?: boolean;
  clearable?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  className?: string;
}

export interface FormSwitchProps {
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  onLabel?: string;
  offLabel?: string;
  className?: string;
}

export interface FormSliderProps {
  label: string;
  description?: string;
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  min?: number;
  max?: number;
  step?: number;
  marks?: { value: number; label?: string }[];
  showLabelOnHover?: boolean;
  className?: string;
}
