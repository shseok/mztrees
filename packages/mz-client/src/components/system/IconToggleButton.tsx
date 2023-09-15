import React from "react";
import { Size } from "@/types/db";
import styles from "@/styles/IconToggleButton.module.scss";
import { cn } from "@/utils/common";
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from "@/utils/dynamic";

interface Props {
  onClick: () => void;
  isActive: boolean;
  size: Size;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  ariaLabel: string;
}

const IconToggleButton = ({
  onClick,
  isActive,
  size,
  activeIcon,
  inactiveIcon,
  ariaLabel,
}: Props) => {
  return (
    <button
      className={cn(styles.styled_button, styles[size])}
      onClick={onClick}
      aria-label={`${ariaLabel} toggle button`}
    >
      <AnimatePresence initial={false}>
        {isActive ? (
          <LazyMotion features={loadFeature}>
            <MotionDiv
              className={styles.svg_wrapper}
              key="fill"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              {activeIcon}
            </MotionDiv>
          </LazyMotion>
        ) : (
          <LazyMotion features={loadFeature}>
            <MotionDiv
              className={styles.svg_wrapper}
              key="outline"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              {inactiveIcon}
            </MotionDiv>
          </LazyMotion>
        )}
      </AnimatePresence>
    </button>
  );
};

export default IconToggleButton;
