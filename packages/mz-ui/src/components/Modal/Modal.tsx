import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/styles/Modal.module.scss";
import { cn } from "@/utils/common";
import { Overlay } from "../system/Overlay";
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
            <motion.div
              initial={{ y: "30vh", opacity: 0 }}
              animate={{ y: "0vh", opacity: 1 }}
              exit={{ y: "30vh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cn(styles.block, className && styles[className])}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Modal;
