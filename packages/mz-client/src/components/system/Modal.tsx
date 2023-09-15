import React from "react";
import Overlay from "./Overlay";
import styles from "@/styles/Modal.module.scss";
import { cn } from "@/utils/common";
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from "@/utils/dynamic";

interface Props {
  visible: boolean;
  className?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Modal = ({ visible, children, className, fullWidth = false }: Props) => {
  return (
    <>
      <Overlay visible={visible} />
      <div className={cn(styles.positioner, fullWidth && styles.fullWidth)}>
        <AnimatePresence>
          {visible && (
            <LazyMotion features={loadFeature}>
              <MotionDiv
                initial={{ y: "30vh", opacity: 0 }}
                animate={{ y: "0vh", opacity: 1 }}
                exit={{ y: "30vh", opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={cn(styles.block, className && styles[className])}
              >
                {children}
              </MotionDiv>
            </LazyMotion>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Modal;
