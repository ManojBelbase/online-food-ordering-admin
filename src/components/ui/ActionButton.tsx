import React from 'react';
import { Button as MantineButton, type ButtonProps as MantineButtonProps } from '@mantine/core';
import { useTheme } from '../../contexts/ThemeContext';

interface ActionButtonProps extends Omit<MantineButtonProps, 'variant' | 'color' | 'size'> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'outline' | 'ghost' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  width?: string | number;
  height?: string | number;
  fontSize?: string | number;
  fontWeight?: number | string;
  borderRadius?: string | number;
  name?: 'submit' | 'cancel' | string;
  onClick?: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  size = 'md',
  width,
  height,
  fontSize,
  fontWeight,
  borderRadius,
  name,
  children,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  // Size mapping
  const sizeMap = {
    xs: { height: '24px', fontSize: '11px', padding: '0 8px' },
    sm: { height: '32px', fontSize: '12px', padding: '0 12px' },
    md: { height: '36px', fontSize: '13px', padding: '0 16px' },
    lg: { height: '42px', fontSize: '14px', padding: '0 20px' },
    xl: { height: '48px', fontSize: '16px', padding: '0 24px' }
  };

  // Variant styles
  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.primary || '#007bff',
      color: 'white',
      border: 'none',
      '&:hover': {
        backgroundColor: theme.colors.primaryHover || '#0056b3'
      }
    },
    secondary: {
      backgroundColor: theme.colors.secondary || '#6c757d',
      color: 'white',
      border: 'none',
      '&:hover': {
        backgroundColor: theme.colors.secondaryHover || '#545b62'
      }
    },
    success: {
      backgroundColor: theme.colors.success || '#28a745',
      color: 'white',
      border: 'none',
      '&:hover': {
        backgroundColor: '#1e7e34'
      }
    },
    error: {
      backgroundColor: theme.colors.error || '#dc3545',
      color: 'white',
      border: 'none',
      '&:hover': {
        backgroundColor: theme.colors.error || '#c82333'
      }
    },
    warning: {
      backgroundColor: theme.colors.warning || '#ffc107',
      color: '#212529',
      border: 'none',
      '&:hover': {
        backgroundColor: theme.colors.warning || '#e0a800'
      }
    },
    outline: {
      backgroundColor: 'transparent',
      color: theme.colors.primary || '#007bff',
      border: `1px solid ${theme.colors.primary || '#007bff'}`,
      '&:hover': {
        backgroundColor: theme.colors.primary || '#007bff',
        color: 'white'
      }
    },
    ghost: {
      backgroundColor: 'transparent',
      color: theme.colors.textPrimary || '#212529',
      border: 'none',
      '&:hover': {
        backgroundColor: theme.colors.surface || '#f8f9fa'
      }
    },
    link: {
      backgroundColor: 'transparent',
      color: theme.colors.primary || '#007bff',
      border: 'none',
      textDecoration: 'underline',
      '&:hover': {
        color: theme.colors.primaryHover || '#0056b3'
      }
    }
  };

  // Default names mapping
  const nameMap = {
    submit: 'Submit',
    cancel: 'Cancel'
  };

  const getButtonText = () => {
    if (children) return children;
    if (name && nameMap[name as keyof typeof nameMap]) {
      return nameMap[name as keyof typeof nameMap];
    }
    return name || 'Button';
  };

  const sizeStyle = sizeMap[size];
  const variantStyle = variantStyles[variant];

  const customStyle = {
    ...sizeStyle,
    ...variantStyle,
    width: width,
    height: height || sizeStyle.height,
    fontSize: fontSize || sizeStyle.fontSize,
    fontWeight: fontWeight || 500,
    borderRadius: borderRadius || '6px',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };

  return (
    <MantineButton
      style={customStyle}
      {...props}
    >
      {getButtonText()}
    </MantineButton>
  );
};

export default ActionButton;
