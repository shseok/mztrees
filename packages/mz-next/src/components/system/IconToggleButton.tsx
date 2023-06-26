import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Size } from "@/lib/api/types";
import styles from "@/styles/CommentItem.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

interface Props {
  onClick: () => void;
  isActive: boolean;
  size: Size;
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
}

const IconToggleButton = ({
  onClick,
  isActive,
  size,
  activeIcon,
  inactiveIcon,
}: Props) => {
  return (
    <button className={cx("styled_button", size)} onClick={onClick}>
      <AnimatePresence initial={false}>
        {isActive ? (
          <motion.div
            className={styles.svg_wrapper}
            key="fill"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {activeIcon}
          </motion.div>
        ) : (
          <motion.div
            className={styles.svg_wrapper}
            key="outline"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {inactiveIcon}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default IconToggleButton;
