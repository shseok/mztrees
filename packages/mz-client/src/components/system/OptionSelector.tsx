import React from 'react';
import Modal from './Modal';
import Button from './Button';
import styles from '@/styles/OptionSelector.module.scss';
import type { Tag, TagList } from '@/types/db';
import { cn } from '@/utils/common';

interface Props {
  visible: boolean;
  title: string;
  list: string[];
  confirmText: string;
  cancelText: string;
  selected: TagList;
  onSelect(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: string
  ): void;
  onClose(): void;
  onConfirm(): void;
  mode?: 'alert' | 'confirm';
}

const OptionSelector = ({
  visible,
  title,
  list,
  onClose,
  onSelect,
  onConfirm,
  selected,
  confirmText,
  cancelText,
  mode = 'alert',
}: Props) => {
  return (
    <Modal className='styled_modal' visible={visible}>
      <h3 className={styles.title}>{title}</h3>
      <section className={styles.listContainer}>
        {list.map((item, index) => (
          <button
            type='button'
            aria-label='옵션 선택'
            className={cn(
              styles.item,
              selected.includes(item as Tag) && styles.selected
            )}
            key={index}
            onClick={(e) => onSelect(e, item)}
            tabIndex={0}
          >
            # {item}
          </button>
        ))}
      </section>
      <section className={styles.footer}>
        <Button
          type='button'
          aria-label='옵션 선택 모달 확인'
          size='large'
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
        {mode === 'confirm' && (
          <Button
            type='button'
            aria-label='옵션 선택 모달 취소'
            size='large'
            variant='secondary'
            onClick={onClose}
          >
            {cancelText}
          </Button>
        )}
      </section>
    </Modal>
  );
};

export default OptionSelector;
