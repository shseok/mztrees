"use client";
import styles from "@/styles/GifSelectButton.module.scss";
import { cn } from "@/utils/common";
import { useTheme } from "@/context/ThemeContext";
import { useGifSelector } from "@/context/GifSelectorContext";

const GifSelectButton = () => {
  const { mode } = useTheme();
  const { open } = useGifSelector();
  return (
    <>
      <button
        className={cn(styles.container, mode === "dark" && styles.dark_mode)}
        onClick={(e) => {
          e.preventDefault();
          open();
        }}
      >
        GIF 파일검색
      </button>
    </>
  );
};

export default GifSelectButton;
