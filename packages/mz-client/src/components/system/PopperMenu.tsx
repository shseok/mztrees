import { AnimatePresence, motion } from "framer-motion";
import styles from "@/styles/PopperMenu.module.scss";
import { useRef } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOuteside";
import { cn } from "@/utils/common";

export interface PopperMenuItem {
  name: string;
  onClick: () => void;
}

interface Props {
  visible: boolean;
  items: PopperMenuItem[];
  mode: "comment" | "item";
  onClose: (e?: Event) => void;
}

const PopperMenu = ({ visible, mode, items, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, (e) => {
    onClose(e);
  });

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          className={cn(styles.block, styles[mode])}
          onClick={() => {
            onClose();
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          ref={ref}
        >
          <div className={styles.triangle} />
          <div className={styles.triangle_border} />
          {/* TODO: Add icon at each menu item */}
          {items.map((item) => (
            <div
              className={styles.menu_item}
              key={item.name}
              onClick={() => {
                item.onClick();
              }}
            >
              {item.name}
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopperMenu;
