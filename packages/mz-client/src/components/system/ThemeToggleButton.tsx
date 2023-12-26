'use client';

import { useTheme } from '@/context/ThemeContext';
import styles from '@/styles/ThemeToggleButton.module.scss';
import { Sun, Moon } from '@/components/vectors';
import { cn } from '@/utils/common';
import { roboto } from '@/lib/fonts';

const ThemeToggleButton = () => {
  const { toggle, mode } = useTheme();
  return (
    <button
      className={cn(styles.container, mode === 'dark' && styles.dark_mode)}
      onClick={toggle}
      aria-label='테마 전환'
    >
      {mode === 'dark' ? (
        <>
          <Sun />
          <span className={cn(styles.dark_mode, roboto.className)}>
            라이트 모드로 전환
          </span>
        </>
      ) : (
        <>
          <Moon />
          <span className={cn(styles.light_mode, roboto.className)}>
            다크 모드로 전환
          </span>
        </>
      )}
    </button>
  );
};

export default ThemeToggleButton;
