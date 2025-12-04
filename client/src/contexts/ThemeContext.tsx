import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme?: () => void;
  switchable: boolean;
  isDarkMode: boolean;
  gradientStyleValue: string;
  gradientClass: string;
  fontClass: string;
  getPrimaryColors: () => { from: string; to: string; colors: string[] };
  candyPaint?: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme");
      return (stored as Theme) || defaultTheme;
    }
    return defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (switchable) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable]);

  const toggleTheme = switchable
    ? () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"));
      }
    : undefined;

  const isDarkMode = theme === "dark";
  const gradientStyleValue = theme === "dark"
    ? 'linear-gradient(135deg, #A855F7 0%, #EC4899 50%, #06B6D4 100%)'
    : 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)';
  const gradientClass = theme === "dark" ? 'candy-text' : '';
  const fontClass = '';
  const getPrimaryColors = () => theme === "dark"
    ? { from: '#A855F7', to: '#06B6D4', colors: ['#A855F7', '#EC4899', '#06B6D4', '#F97316', '#3B82F6'] }
    : { from: '#3B82F6', to: '#06B6D4', colors: ['#3B82F6', '#8B5CF6', '#EC4899', '#F97316', '#06B6D4'] };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme,
      toggleTheme, 
      switchable,
      isDarkMode,
      gradientStyleValue,
      gradientClass,
      fontClass,
      getPrimaryColors,
      candyPaint: undefined
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
