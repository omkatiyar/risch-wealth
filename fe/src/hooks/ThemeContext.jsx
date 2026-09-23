import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

function getInitialIsDark() {
  try {
    return localStorage.getItem('risch-theme') !== 'light';
  } catch {
    return true;
  }
}

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(getInitialIsDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('risch-theme', next ? 'dark' : 'light');
      } catch {
        // localStorage unavailable — toggle for this view only
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
