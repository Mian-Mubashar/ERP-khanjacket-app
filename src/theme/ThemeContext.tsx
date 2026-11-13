import React, { createContext, useContext, useState } from 'react';

export interface ThemePalette {
  isDarkMode: boolean;
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderDark: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textWhite: string;
  brandDark: string;
  brandNavy: string;
  brandBlue: string;
  brandBlueLight: string;
  brandBlueBorder: string;
  success: string;
  successLight: string;
  successBorder: string;
  danger: string;
  dangerLight: string;
  dangerBorder: string;
  warning: string;
  warningLight: string;
  warningBorder: string;
  purple: string;
  purpleLight: string;
  overlay: string;
}

const lightTheme: ThemePalette = {
  isDarkMode: false,
  background: '#f8fafc',       // Slate-50
  surface: '#ffffff',          // Pure White Card
  surfaceMuted: '#f1f5f9',     // Slate-100
  border: '#e2e8f0',           // Slate-200
  borderDark: '#cbd5e1',
  textPrimary: '#0f172a',      // Slate-900
  textSecondary: '#475569',    // Slate-600
  textMuted: '#94a3b8',        // Slate-400
  textWhite: '#ffffff',
  brandDark: '#0f172a',        // Header Navy
  brandNavy: '#17324d',
  brandBlue: '#2563eb',        // Primary Blue
  brandBlueLight: '#eff6ff',   // Soft Blue Tint
  brandBlueBorder: '#bfdbfe',
  success: '#059669',
  successLight: '#ecfdf5',
  successBorder: '#a7f3d0',
  danger: '#dc2626',
  dangerLight: '#fef2f2',
  dangerBorder: '#fecaca',
  warning: '#d97706',
  warningLight: '#fffbeb',
  warningBorder: '#fde68a',
  purple: '#7c3aed',
  purpleLight: '#f5f3ff',
  overlay: 'rgba(15, 23, 42, 0.65)',
};

const darkTheme: ThemePalette = {
  isDarkMode: true,
  background: '#090d16',       // Ultra Deep Slate-950
  surface: '#111827',          // Slate-900 Card
  surfaceMuted: '#1e293b',     // Slate-800
  border: '#1f293d',           // Subtle Dark Border
  borderDark: '#334155',
  textPrimary: '#f8fafc',      // Crisp White
  textSecondary: '#cbd5e1',    // Slate-300
  textMuted: '#64748b',        // Slate-500
  textWhite: '#ffffff',
  brandDark: '#020617',        // Pitch Black Header
  brandNavy: '#0f172a',
  brandBlue: '#3b82f6',        // Vibrant Blue
  brandBlueLight: '#172554',   // Blue-950 Tint
  brandBlueBorder: '#1d4ed8',
  success: '#10b981',
  successLight: '#064e3b',
  successBorder: '#047857',
  danger: '#f43f5e',
  dangerLight: '#4c0519',
  dangerBorder: '#9f1239',
  warning: '#f59e0b',
  warningLight: '#451a03',
  warningBorder: '#b45309',
  purple: '#a855f7',
  purpleLight: '#3b0764',
  overlay: 'rgba(2, 6, 23, 0.85)',
};

interface ThemeContextType {
  isDarkMode: boolean;
  theme: ThemePalette;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  theme: lightTheme,
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

