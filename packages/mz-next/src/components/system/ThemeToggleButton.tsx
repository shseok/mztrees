"use client";

import { useTheme } from "@/context/ThemeContext";
import styles from "@/styles/ThemeToggleButton.module.scss";
import { Sun, Moon } from "@/components/vectors";
import { cn } from "@/utils/common";

const ThemeToggleButton = () => {
  const { toggle, mode } = useTheme();
  return (
    <div className={styles.container}>
      <input
        type="checkbox"
        className={styles.checkbox}
        id="checkbox"
        onClick={toggle}
      />
      <label
        htmlFor="checkbox"
        className={cn(styles.checkbox_label, styles[mode])}
      >
        <div className={styles.moon_wrapper}>
          <Moon />
        </div>
        <div className={styles.sun_wrapper}>
          <Sun />
        </div>
        <span className={styles.ball} />
      </label>
    </div>
  );
};

export default ThemeToggleButton;
