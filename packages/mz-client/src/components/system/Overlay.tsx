import React from "react";
import styles from "@/styles/Overlay.module.scss";
import { AnimatePresence, MotionDiv } from "@/utils/dynamic";

interface Props {
  visible: boolean;
  onClose?: () => void;
}

const Overlay = ({ visible, onClose }: Props) => {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <MotionDiv
          className={styles.fill}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        ></MotionDiv>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
