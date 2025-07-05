import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Theme, ThemeName } from "../constants/theme";
import { darkTheme, lightTheme } from "../constants/theme";

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
  setTheme: (themeName: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as ThemeName;
      return savedTheme || "dark";
    }
    return "dark";
  });

  const theme = themeName === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", themeName);

      // Update CSS custom properties for global styling
      const root = document.documentElement;

      // Set CSS custom properties for the current theme
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });

      Object.entries(theme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value);
      });

      // Set theme name as data attribute for CSS selectors
      root.setAttribute("data-theme", themeName);
    }
  }, [theme, themeName]);

  const toggleTheme = () => {
    setThemeName((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
  };

  const value: ThemeContextType = {
    theme,
    themeName,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useThemeStyles = () => {
  const { theme } = useTheme();

  return {
    // Common style generators
    card: {
      backgroundColor: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: "8px",
      boxShadow: theme.shadows.sm,
    },

    button: {
      primary: {
        backgroundColor: theme.colors.primary,
        color: theme.colors.textOnPrimary,
        border: "none",
        borderRadius: "6px",
        padding: "8px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
          backgroundColor: theme.colors.primaryHover,
        },
      },
      secondary: {
        backgroundColor: "transparent",
        color: theme.colors.textSecondary,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: "6px",
        padding: "8px 16px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        ":hover": {
          backgroundColor: theme.colors.surfaceHover,
          borderColor: theme.colors.borderHover,
        },
      },
    },

    input: {
      backgroundColor: theme.colors.inputBackground,
      border: `1px solid ${theme.colors.inputBorder}`,
      borderRadius: "6px",
      padding: "8px 12px",
      color: theme.colors.inputText,
      "::placeholder": {
        color: theme.colors.inputPlaceholder,
      },
      ":focus": {
        outline: "none",
        borderColor: theme.colors.primary,
        boxShadow: `0 0 0 3px ${theme.colors.primary}20`,
      },
    },

    text: {
      primary: { color: theme.colors.textPrimary },
      secondary: { color: theme.colors.textSecondary },
      tertiary: { color: theme.colors.textTertiary },
      disabled: { color: theme.colors.textDisabled },
    },
  };
};
