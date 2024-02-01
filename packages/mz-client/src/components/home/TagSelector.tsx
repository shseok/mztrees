import React, { useRef, useState } from 'react';
import styles from '@/styles/TagSelector.module.scss';
import { ChevronDown, ChevronUp, Close } from '../vectors';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import TagMenu from './TagMenu';
import type { Tag } from '@/types/db';
import { homeParameterStore } from '@/hooks/stores/HomeParameterStore';
import { shallow } from 'zustand/shallow';

const TagSelector = () => {
  const { mode } = useTheme();
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { tag, setTag } = homeParameterStore(
    (state) => ({ tag: state.tag, setTag: state.setTag }),
    shallow
  );
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

  const onSelect = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: Tag
  ) => {
    e.preventDefault();
    setTag(value);
  };
  // TODO: button Button으로 refactor
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
      {tag && (
        <div className={styles.current_tag}>
          <span className={styles.tag_text}># {tag}</span>
          <button
            type='button'
            aria-label='선택한 태그 지우기'
            className={styles.close_btn}
            onClick={() => {
              setTag(null);
            }}
          >
            <Close />
          </button>
        </div>
      )}
      <TagMenu
        visible={visible}
        onClose={onClose}
        selected={tag}
        onSelect={onSelect}
      />
    </div>
  );
};

export default TagSelector;
