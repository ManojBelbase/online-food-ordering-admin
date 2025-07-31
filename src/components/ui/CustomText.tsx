import React from 'react';
import { Text as MantineText, type TextProps as MantineTextProps } from '@mantine/core';
import { useTheme } from '../../contexts/ThemeContext';

interface CustomTextProps extends Omit<MantineTextProps, 'size' | 'color'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | string;
  fontSize?: string | number;
  fontWeight?: number | string;
  width?: string | number;
  lineHeight?: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  margin?: string | number;
  padding?: string | number;
  children?: React.ReactNode;
}

const CustomText: React.FC<CustomTextProps> = ({
  size = 'md',
  color = 'primary',
  fontSize,
  fontWeight,
  width,
  lineHeight,
  textAlign,
  margin,
  padding,
  children,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  // Size mapping
  const sizeMap = {
    xs: '11px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px'
  };

  // Color mapping
  const colorMap = {
    primary: theme.colors.textPrimary || '#212529',
    secondary: theme.colors.textSecondary || '#6c757d',
    success: theme.colors.success || '#28a745',
    error: theme.colors.error || '#dc3545',
    warning: theme.colors.warning || '#ffc107',
    info: '#17a2b8'
  };

  const getFontSize = () => {
    if (fontSize) return fontSize;
    if (typeof size === 'string' && sizeMap[size as keyof typeof sizeMap]) {
      return sizeMap[size as keyof typeof sizeMap];
    }
    return size;
  };

  const getColor = () => {
    if (colorMap[color as keyof typeof colorMap]) {
      return colorMap[color as keyof typeof colorMap];
    }
    return color;
  };

  const customStyle = {
    fontSize: getFontSize(),
    color: getColor(),
    fontWeight: fontWeight || 400,
    width: width,
    lineHeight: lineHeight || 1.4,
    textAlign: textAlign,
    margin: margin || 0,
    padding: padding || 0,
    ...style
  };

  return (
    <MantineText style={customStyle} {...props}>
      {children}
    </MantineText>
  );
};

export default CustomText;
