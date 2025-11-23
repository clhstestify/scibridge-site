import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme] = useState('light');

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    document.body.classList.add('theme-light');
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme: () => {},
      toggleTheme: () => {}
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
