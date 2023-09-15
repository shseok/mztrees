import React from "react";
import Overlay from "./Overlay";
import { BottomSheetModalItem } from "@/hooks/stores/useBottomSheetModalStore";
import styles from "@/styles/BottomSheetModal.module.scss";
import { AnimatePresence, MotionDiv } from "@/utils/dynamic";

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
          <MotionDiv
            className={styles.sheet}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
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
        )}
      </AnimatePresence>
    </>
  );
};
export default BottomSheetModal;
