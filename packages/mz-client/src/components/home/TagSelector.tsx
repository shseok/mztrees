import React, { useRef, useState } from 'react';
import styles from '@/styles/TagSelector.module.scss';
import { ChevronDown, ChevronUp, Close } from '../vectors';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import TagMenu from './TagMenu';
import type { SortMode, Tag } from '@/types/db';
import useSetSearchParams from '@/hooks/useSetSearchParams';

interface Props {
  sortMode: SortMode;
  selectedTag: Tag | null;
  setSelectedTag: (tag: Tag | null) => void;
}

const TagSelector = ({ sortMode, selectedTag, setSelectedTag }: Props) => {
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
        type='button'
        aria-label='태그 목록 토글'
        className={styles.inner_container}
        onClick={onToggle}
        ref={buttonRef}
      >
        <span>태그 목록</span>
        {visible ? <ChevronUp /> : <ChevronDown />}
      </button>
      {selectedTag && (
        <div className={styles.current_tag}>
          <span className={styles.tag_text}># {selectedTag}</span>
          <button
            type='button'
            aria-label='선택한 태그 지우기'
            className={styles.close_btn}
            onClick={() => {
              setSelectedTag(null);
              setSearchParams({ mode: sortMode, tag: null });
            }}
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
          setSearchParams({ mode: sortMode, tag: value });
        }}
      />
    </div>
  );
};

export default TagSelector;
