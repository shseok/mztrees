import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/styles/Overlay.module.scss";

interface Props {
  visible: boolean;
  onClose?: () => void;
}

const Overlay = ({ visible, onClose }: Props) => {
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          className={styles.fill}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        ></motion.div>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
