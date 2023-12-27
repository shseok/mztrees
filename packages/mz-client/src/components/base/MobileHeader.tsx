'use client';

import React from 'react';
import { Logo } from '@/components/vectors';
import styles from '@/styles/MobileHeader.module.scss';
import { cn } from '@/utils/common';
import { useTheme } from '@/context/ThemeContext';
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
  const { mode } = useTheme();
  return (
    <header className={cn(styles.block, className && styles[className])}>
      {headerLeft && (
        <div className={cn(styles.header_side, styles.left)}>{headerLeft}</div>
      )}
      <h1 className={cn(styles.title, mode === 'dark' && styles.dark)}>
        {title}
      </h1>
      {headerRight && (
        <div className={cn(styles.header_side, styles.right)}>
          {headerRight}
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
