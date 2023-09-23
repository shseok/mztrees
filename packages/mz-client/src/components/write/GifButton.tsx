"use client";

import React, { useState } from "react";
import styles from "@/styles/GifSelectButton.module.scss";
import { cn } from "@/utils/common";
import { useTheme } from "@/context/ThemeContext";
import GifSelectModal from "../system/GifSelectModal";

const GifSelectButton = () => {
  const { mode } = useTheme();
  const [visible, setVisible] = useState(false);
  return (
    <>
      <button
        className={cn(styles.container, mode === "dark" && styles.dark_mode)}
        onClick={(e) => {
          e.preventDefault();
          setVisible(true);
        }}
      >
        GIF 파일검색
      </button>
      <GifSelectModal
        visible={visible}
        onClose={(e) => {
          e.preventDefault();
          setVisible(false);
        }}
      />
    </>
  );
};

export default GifSelectButton;
