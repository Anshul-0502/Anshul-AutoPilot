import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Theme options: 'dark' | 'light' | 'auto'
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('autopilot-theme');
    return saved || 'dark'; // Dark theme default
  });

  const setTheme = (newTheme) => {
    localStorage.setItem('autopilot-theme', newTheme);
    setThemeState(newTheme);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const applyTheme = () => {
      let resolvedTheme = theme;
      if (theme === 'auto') {
        resolvedTheme = mediaQuery.matches ? 'dark' : 'light';
      }
      
      const root = document.documentElement;
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme();

    // Listen for system theme change when Auto mode is active
    const listener = () => {
      if (theme === 'auto') {
        applyTheme();
      }
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
