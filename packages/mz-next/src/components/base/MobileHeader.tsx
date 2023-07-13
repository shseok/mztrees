import React from "react";
import { Logo } from "@/utils/vectors";
import styles from "@/styles/MobileHeader.module.scss";
import { cn } from "@/utils/common";
export interface HeaderProps {
  title?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}

const MobileHeader = ({
  title = <Logo />,
  headerLeft,
  headerRight,
  className,
}: HeaderProps) => {
  return (
    <header className={cn(styles.block, className && styles[className])}>
      {headerLeft && (
        <div className={cn(styles.header_side, styles.left)}>{headerLeft}</div>
      )}
      <div className={styles.title}>{title}</div>
      {headerRight && (
        <div className={cn(styles.header_side, styles.right)}>
          {headerRight}
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
