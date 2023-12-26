import React, { useRef, useState } from 'react';
import styles from '@/styles/TagSelector.module.scss';
import { ChevronDown, ChevronUp, Close } from '../vectors';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import TagMenu from './TagMenu';
import type { ListMode, Tag } from '@/types/db';
import useSetSearchParams from '@/hooks/useSetSearchParams';

interface Props {
  listMode: ListMode;
  selectedTag: Tag | null;
  setSelectedTag: (tag: Tag | null) => void;
}

const TagSelector = ({ listMode, selectedTag, setSelectedTag }: Props) => {
  const { mode } = useTheme();
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const setSearchParams = useSetSearchParams();
  const onToggle = () => {
    setVisible(!visible);
  };
  const onClose = (e?: Event) => {
    const buttonEl = buttonRef?.current;
    const isButton =
      buttonEl === e?.target || buttonEl?.contains(e?.target as Node);
    if (isButton) return;

    setVisible(false);
  };
  return (
    <div className={cn(styles.container, mode === 'dark' && styles.dark)}>
      <button
        className={styles.inner_container}
        onClick={onToggle}
        aria-label='Open tag menu'
        ref={buttonRef}
      >
        <span>태그 목록</span>
        {visible ? <ChevronUp /> : <ChevronDown />}
      </button>
      {selectedTag && (
        <div className={styles.current_tag}>
          <span className={styles.tag_text}># {selectedTag}</span>
          <button
            className={styles.close_btn}
            onClick={() => {
              setSelectedTag(null);
              setSearchParams({ mode: listMode, tag: null });
            }}
            aria-label='Close selected tag'
          >
            <Close />
          </button>
        </div>
      )}

      <TagMenu
        visible={visible}
        onClose={onClose}
        selected={selectedTag}
        onSelect={(
          e: React.MouseEvent<HTMLLIElement, MouseEvent>,
          value: Tag
        ) => {
          e.preventDefault();
          setSelectedTag(value);
          setSearchParams({ mode: listMode, tag: value });
        }}
      />
    </div>
  );
};

export default TagSelector;
