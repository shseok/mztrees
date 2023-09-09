import { useOnClickOutside } from "@/hooks/useOnClickOuteside";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";
import styles from "@/styles/TagMenu.module.scss";
import { tagList } from "@/lib/const";
import { ListMode, Tag } from "@/types/db";
import { cn } from "@/utils/common";
import Link from "next/link";

interface Props {
  listMode: ListMode;
  visible: boolean;
  selected: Tag | null;
  onClose: (e?: Event) => void;
  onSelect: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, item: Tag) => void;
}

const TagMenu = ({ listMode, onClose, visible, selected, onSelect }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const link = (item: Tag) => `/?mode=${listMode}&tag=${item}`;
  // const router = useRouter();
  useOnClickOutside(ref, (e) => {
    onClose(e);
  });
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          className={styles.block}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          ref={ref}
        >
          <ul className={styles.tag_list}>
            {tagList.map((item, idx) => (
              <li
                className={cn(styles.tag, selected === item && styles.selected)}
                onClick={(e) => {
                  onSelect(e, item);
                  onClose();
                }}
                key={idx}
              >
                <Link href={link(item)}>{item}</Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TagMenu;
