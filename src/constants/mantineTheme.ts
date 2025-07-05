import { createTheme, type MantineColorsTuple } from '@mantine/core';
import { colors } from './theme';

// Define custom color tuples for Mantine
const primaryColors: MantineColorsTuple = [
  colors.primary[50],
  colors.primary[100],
  colors.primary[200],
  colors.primary[300],
  colors.primary[400],
  colors.primary[500],
  colors.primary[600],
  colors.primary[700],
  colors.primary[800],
  colors.primary[900],
];

const successColors: MantineColorsTuple = [
  colors.success[50],
  colors.success[100],
  colors.success[200],
  colors.success[300],
  colors.success[400],
  colors.success[500],
  colors.success[600],
  colors.success[700],
  colors.success[800],
  colors.success[900],
];

const errorColors: MantineColorsTuple = [
  colors.error[50],
  colors.error[100],
  colors.error[200],
  colors.error[300],
  colors.error[400],
  colors.error[500],
  colors.error[600],
  colors.error[700],
  colors.error[800],
  colors.error[900],
];

const warningColors: MantineColorsTuple = [
  colors.warning[50],
  colors.warning[100],
  colors.warning[200],
  colors.warning[300],
  colors.warning[400],
  colors.warning[500],
  colors.warning[600],
  colors.warning[700],
  colors.warning[800],
  colors.warning[900],
];

// Create the base Mantine theme
export const mantineTheme = createTheme({
  colors: {
    primary: primaryColors,
    success: successColors,
    error: errorColors,
    warning: warningColors,
  },
  primaryColor: 'primary',
  primaryShade: { light: 6, dark: 5 },
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    fontWeight: '600',
  },
  radius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'md',
        shadow: 'lg',
        centered: true,
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'md',
      },
    },
    Select: {
      defaultProps: {
        radius: 'md',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'md',
      },
    },
  },
});
