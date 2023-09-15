import React from "react";
import styles from "@/styles/Overlay.module.scss";
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from "@/utils/dynamic";

interface Props {
  visible: boolean;
  onClose?: () => void;
}

const Overlay = ({ visible, onClose }: Props) => {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <LazyMotion features={loadFeature}>
          <MotionDiv
            className={styles.fill}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          ></MotionDiv>
        </LazyMotion>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
