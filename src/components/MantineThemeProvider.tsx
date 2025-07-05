import React from 'react';
import { MantineProvider, type MantineColorScheme } from '@mantine/core';
import { useTheme } from '../contexts/ThemeContext';
import { mantineTheme } from '../constants/mantineTheme';

interface MantineThemeProviderProps {
  children: React.ReactNode;
}

export const MantineThemeProvider: React.FC<MantineThemeProviderProps> = ({ children }) => {
  const { themeName, theme } = useTheme();
  
  const colorScheme: MantineColorScheme = themeName === 'dark' ? 'dark' : 'light';

  const dynamicTheme = {
    ...mantineTheme,
    colorScheme,
    colors: {
      ...mantineTheme.colors,
      dark: [
        theme.colors.textPrimary,
        theme.colors.textSecondary,
        theme.colors.textTertiary,
        theme.colors.border,
        theme.colors.surface,
        theme.colors.surfaceHover,
        theme.colors.background,
        theme.colors.backgroundSecondary,
        theme.colors.backgroundTertiary,
        theme.colors.textDisabled,
      ] as const,
    },
    other: {
      // Pass our custom theme colors to Mantine components
      customColors: theme.colors,
    },
  };

  return (
    <MantineProvider theme={dynamicTheme} forceColorScheme={colorScheme}>
      {children}
    </MantineProvider>
  );
};
