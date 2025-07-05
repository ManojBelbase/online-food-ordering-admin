// Modern color palette for dark and light themes
export const colors = {
  // Primary colors - Modern blue palette
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6", // Main primary
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554",
  },

  // Secondary colors - Modern purple palette
  secondary: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7", // Main secondary
    600: "#9333ea",
    700: "#7c3aed",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764",
  },

  // Success colors - Modern green
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Main success
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Warning colors - Modern amber
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b", // Main warning
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Error colors - Modern red
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444", // Main error
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Neutral colors for both themes
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a",
  },
};

// Dark theme configuration
export const darkTheme = {
  name: "dark",
  colors: {
    // Primary colors
    primary: colors.primary[500],
    primaryHover: colors.primary[400],
    primaryActive: colors.primary[600],
    primaryLight: colors.primary[100],
    primaryDark: colors.primary[700],

    // Secondary colors
    secondary: colors.secondary[500],
    secondaryHover: colors.secondary[400],
    secondaryActive: colors.secondary[600],

    // Status colors
    success: colors.success[500],
    warning: colors.warning[500],
    error: colors.error[500],

    // Background colors
    background: colors.neutral[950], // Very dark background
    backgroundSecondary: colors.neutral[900], // Slightly lighter
    backgroundTertiary: colors.neutral[800], // Cards, modals

    // Surface colors
    surface: colors.neutral[900],
    surfaceHover: colors.neutral[800],
    surfaceActive: colors.neutral[700],

    // Border colors
    border: colors.neutral[700],
    borderLight: colors.neutral[600],
    borderHover: colors.neutral[500],

    // Text colors
    textPrimary: colors.neutral[50], // Main text
    textSecondary: colors.neutral[300], // Secondary text
    textTertiary: colors.neutral[400], // Muted text
    textDisabled: colors.neutral[600],
    textOnPrimary: colors.neutral[50],
    textOnSecondary: colors.neutral[50],

    // Sidebar specific
    sidebarBackground: colors.neutral[900],
    sidebarHover: colors.neutral[800],
    sidebarActive: colors.primary[600],
    sidebarText: colors.neutral[300],
    sidebarTextActive: colors.neutral[50],

    // Navbar specific
    navbarBackground: colors.neutral[950],
    navbarBorder: colors.neutral[700],
    navbarText: colors.neutral[50],

    // Input colors
    inputBackground: colors.neutral[800],
    inputBorder: colors.neutral[600],
    inputText: colors.neutral[50],
    inputPlaceholder: colors.neutral[400],
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
  },
};

// Light theme configuration
export const lightTheme = {
  name: "light",
  colors: {
    // Primary colors
    primary: colors.primary[600],
    primaryHover: colors.primary[700],
    primaryActive: colors.primary[800],
    primaryLight: colors.primary[50],
    primaryDark: colors.primary[800],

    // Secondary colors
    secondary: colors.secondary[600],
    secondaryHover: colors.secondary[700],
    secondaryActive: colors.secondary[800],

    // Status colors
    success: colors.success[600],
    warning: colors.warning[600],
    error: colors.error[600],

    // Background colors
    background: colors.neutral[50], // Light background
    backgroundSecondary: colors.neutral[100], // Slightly darker
    backgroundTertiary: colors.neutral[200], // Cards, modals

    // Surface colors
    surface: "#ffffff",
    surfaceHover: colors.neutral[50],
    surfaceActive: colors.neutral[100],

    // Border colors
    border: colors.neutral[200],
    borderLight: colors.neutral[300],
    borderHover: colors.neutral[400],

    // Text colors
    textPrimary: colors.neutral[900], // Main text
    textSecondary: colors.neutral[600], // Secondary text
    textTertiary: colors.neutral[500], // Muted text
    textDisabled: colors.neutral[400],
    textOnPrimary: colors.neutral[50],
    textOnSecondary: colors.neutral[50],

    // Sidebar specific
    sidebarBackground: "#ffffff",
    sidebarHover: colors.neutral[50],
    sidebarActive: colors.primary[50],
    sidebarText: colors.neutral[700],
    sidebarTextActive: colors.primary[700],

    // Navbar specific
    navbarBackground: "#ffffff",
    navbarBorder: colors.neutral[200],
    navbarText: colors.neutral[900],

    // Input colors
    inputBackground: "#ffffff",
    inputBorder: colors.neutral[300],
    inputText: colors.neutral[900],
    inputPlaceholder: colors.neutral[500],
  },
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
};

export type Theme = typeof darkTheme;
export type ThemeName = "dark" | "light";
