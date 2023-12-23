import React from 'react';
import Overlay from './Overlay';
import { BottomSheetModalItem } from '@/hooks/stores/useBottomSheetModalStore';
import styles from '@/styles/BottomSheetModal.module.scss';
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from '@/utils/dynamic';

interface Props {
  visible: boolean;
  items: BottomSheetModalItem[];
  onClose: () => void;
}

const BottomSheetModal = ({ visible, items, onClose }: Props) => {
  return (
    <>
      <Overlay visible={visible} onClose={onClose} />
      <AnimatePresence>
        {visible && (
          <LazyMotion features={loadFeature}>
            <MotionDiv
              className={styles.sheet}
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '100%' }}
              transition={{ dumping: 0 }}
            >
              <div className={styles.items} onClick={onClose}>
                {items.map((item) => (
                  <div
                    className={styles.item}
                    key={item.name}
                    onClick={item.onClick}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            </MotionDiv>
          </LazyMotion>
        )}
      </AnimatePresence>
    </>
  );
};
export default BottomSheetModal;
