'use client';

import React, { useRef } from 'react';
import FullHeightPage from '@/components/system/FullHeightPage';
import MobileHeader from '@/components/base/MobileHeader';
import Footer from '@/components/base/Footer';
import styles from '@/styles/TabLayout.module.scss';
import DesktopHeader from '../base/DesktopHeader';
import { cn } from '@/utils/common';
import { useTabScrollTop } from '@/context/TabScrollTopContext';
import ThemeToggleButton from '../system/ThemeToggleButton';

interface Props {
  className?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
}

const TabLayout = ({ className, children, header }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useTabScrollTop(ref);

  return (
    <FullHeightPage>
      {header ?? (
        <>
          <MobileHeader />
          <DesktopHeader />
        </>
      )}
      {/* <BackgroundContent x={0} y={0} /> */}
      <div
        className={cn(styles.content, className && styles[className])}
        ref={ref}
      >
        {children}
      </div>
      <ThemeToggleButton />
      <Footer />
    </FullHeightPage>
  );
};

export default TabLayout;
