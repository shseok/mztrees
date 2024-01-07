import React from 'react';
import ThemeToggleButton from './ThemeToggleButton';
import ExpandableActionButton from './ExpandableActionButton';
import styles from '@/styles/FloatingActionButtonGroup.module.scss';

export default function FloatingActionButtonGroup() {
  return (
    <div className={styles.container}>
      <ExpandableActionButton />
      <ThemeToggleButton />
    </div>
  );
}
