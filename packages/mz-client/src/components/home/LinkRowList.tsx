import type { Item } from '@/types/db';
import styles from '@/styles/LinkRowList.module.scss';
import React from 'react';
import LinkRow from './LinkRow';

interface Props {
  items: Item[];
}

export default function LinkRowList({ items }: Props) {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <LinkRow key={item.id} item={item} />
      ))}
    </div>
  );
}
