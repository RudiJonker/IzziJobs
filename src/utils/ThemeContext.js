import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

const themes = {
  theme1: {
    background: '#333',
    text: '#fff',
    button: '#48d22b',
    accent: '#48d22b',
  },
  theme2: {
    background: '#1e3a8a',
    text: '#d1d5db',
    button: '#3b82f6',
    accent: '#3b82f6',
  },
  theme3: {
    background: '#7f1d1d',
    text: '#fff',
    button: '#ef4444',
    accent: '#ef4444',
  },
  theme4: {
    background: '#4c1d95',
    text: '#d8b4fe',
    button: '#8b5cf6',
    accent: '#8b5cf6',
  },
  theme5: {
    background: '#111827',
    text: '#fff',
    button: '#6b7280',
    accent: '#6b7280',
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('theme1');

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[theme], updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);