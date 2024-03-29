'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Add } from '@/components/vectors';
import ExpandableActionMenu from './ExpandableActionMenu';
import styles from '@/styles/ExpandableActionButton.module.scss';
import { cn } from '@/utils/common';

export default function ExpandableActionButton() {
  const { mode } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggle = () => setIsExpanded(!isExpanded);
  const close = () => setIsExpanded(false);

  return (
    <>
      <button
        className={cn(styles.container, mode === 'dark' && styles.dark_mode)}
        onClick={toggle}
        aria-label='세부 기능 보기'
        type='button'
      >
        <Add />
      </button>
      <ExpandableActionMenu visible={isExpanded} close={close} />
    </>
  );
}
