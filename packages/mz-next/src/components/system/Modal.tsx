import React from "react";
import Overlay from "./Overlay";
import { AnimatePresence, motion } from "framer-motion";
import styles from "@/styles/Modal.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
interface Props {
  visible: boolean;
  className?: string;
  children: React.ReactNode;
}

const Modal = ({ visible, children, className }: Props) => {
  return (
    <>
      <Overlay visible={visible} />
      <div className={styles.positioner}>
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ y: "30vh", opacity: 0 }}
              animate={{ y: "0vh", opacity: 1 }}
              exit={{ y: "30vh", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={cx(className, "block")}
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
