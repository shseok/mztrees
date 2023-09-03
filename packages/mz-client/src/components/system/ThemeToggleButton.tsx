"use client";

import { useTheme } from "@/context/ThemeContext";
import styles from "@/styles/ThemeToggleButton.module.scss";
import { Sun, Moon } from "@/components/vectors";
import { cn } from "@/utils/common";

const ThemeToggleButton = () => {
  const { toggle, mode } = useTheme();
  return (
    <button
      className={cn(styles.container, mode === "dark" && styles.dark_mode)}
      onClick={toggle}
    >
      {mode === "dark" ? (
        <>
          <Sun />
          <span className={styles.dark_mode}>라이트 모드로 전환</span>
        </>
      ) : (
        <>
          <Moon />
          <span className={styles.light_mode}>다크 모드로 전환</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggleButton;
