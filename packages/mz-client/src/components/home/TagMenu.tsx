import { useOnClickOutside } from '@/hooks/useOnClickOuteside';
import React, { useRef } from 'react';
import styles from '@/styles/TagMenu.module.scss';
import { tagList } from '@/lib/const';
import type { Tag } from '@/types/db';
import { cn } from '@/utils/common';
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from '@/utils/dynamic';

interface Props {
  visible: boolean;
  selected: Tag | null;
  onClose: (e?: Event) => void;
  onSelect: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: Tag
  ) => void;
}

const TagMenu = ({ onClose, visible, selected, onSelect }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, (e) => {
    onClose(e);
  });
  return (
    <div ref={ref} role='menu'>
      <AnimatePresence initial={false}>
        {visible && (
          <LazyMotion features={loadFeature}>
            <MotionDiv
              className={styles.block}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <ul className={styles.tag_list}>
                {tagList.map((item, idx) => (
                  <li>
                    <button
                      className={cn(
                        styles.tag,
                        selected === item && styles.selected
                      )}
                      onClick={(e) => {
                        onSelect(e, item);
                        onClose();
                      }}
                      key={idx}
                      role='menuitem'
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </MotionDiv>
          </LazyMotion>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TagMenu;
