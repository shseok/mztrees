'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'dark' | 'light';

type ThemeContextType = {
  toggle: () => void;
  mode: ThemeMode;
};

type Props = {
  children: React.ReactNode;
};
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

const LOCAL_STORAGE_KEY = 'themeMode'; // 로컬 스토리지에 저장할 키 값

export const ThemeProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    let storedMode = null;
    if (typeof window !== 'undefined') {
      storedMode = localStorage.getItem(LOCAL_STORAGE_KEY);
    }
    return storedMode === 'dark' ? 'dark' : 'light';
  });

  const toggle = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ toggle, mode }}>
      <div className={`theme ${mode}`} style={{ height: '100%' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const result = useContext(ThemeContext);
  if (result === undefined) {
    throw new Error(' useTheme must be used within a ThemeProvider');
  }
  return { toggle: result.toggle, mode: result.mode };
}
