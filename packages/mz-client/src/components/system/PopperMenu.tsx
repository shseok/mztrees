import styles from "@/styles/PopperMenu.module.scss";
import { useRef } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOuteside";
import { cn } from "@/utils/common";
import { Delete, Edit } from "@/components/vectors/index";
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from "@/utils/dynamic";
const IconMap = {
  수정: <Edit />,
  삭제: <Delete />,
} as const;

export interface PopperMenuItem {
  name: string;
  onClick: () => void;
}

interface Props {
  visible: boolean;
  items: PopperMenuItem[];
  mode: "comment" | "item";
  location?: "right" | "left";
  onClose: (e?: Event) => void;
}

const PopperMenu = ({
  visible,
  mode,
  items,
  location = "left",
  onClose,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, (e) => {
    onClose(e);
  });

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <LazyMotion features={loadFeature}>
          <MotionDiv
            className={cn(styles.block, styles[mode], styles[location])}
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
                {IconMap[item.name as keyof typeof IconMap]}
                {item.name}
              </div>
            ))}
          </MotionDiv>
        </LazyMotion>
      )}
    </AnimatePresence>
  );
};

export default PopperMenu;
