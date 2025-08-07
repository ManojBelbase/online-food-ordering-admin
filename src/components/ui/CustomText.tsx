import React from 'react';
import { Text as MantineText, type TextProps as MantineTextProps } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
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
  responsive?: boolean; // Enable responsive sizing
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
  responsive = false,
  ...props
}) => {
  const { theme } = useTheme();

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  // Size mapping with responsive variants
  const sizeMap = {
    xs: { desktop: '11px', tablet: '10px', mobile: '9px' },
    sm: { desktop: '12px', tablet: '11px', mobile: '10px' },
    md: { desktop: '14px', tablet: '13px', mobile: '12px' },
    lg: { desktop: '16px', tablet: '15px', mobile: '14px' },
    xl: { desktop: '18px', tablet: '17px', mobile: '16px' }
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
      const sizeConfig = sizeMap[size as keyof typeof sizeMap];
      if (responsive && typeof sizeConfig === 'object') {
        return isMobile ? sizeConfig.mobile : isTablet ? sizeConfig.tablet : sizeConfig.desktop;
      }
      return typeof sizeConfig === 'object' ? sizeConfig.desktop : sizeConfig;
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
