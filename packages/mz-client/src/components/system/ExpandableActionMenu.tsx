import styles from '@/styles/ExpandableActionMenu.module.scss';
import { Announcement, Download } from '@/components/vectors';
import { useTheme } from '@/context/ThemeContext';
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from '@/utils/dynamic';
import { cn } from '@/utils/common';

interface Props {
  visible: boolean;
}

export default function ExpandableActionMenu({ visible }: Props) {
  const { mode } = useTheme();
  const menuItemClassName = cn(
    styles.menu_item,
    mode === 'dark' && styles.dark_mode
  );

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <LazyMotion features={loadFeature}>
          <MotionDiv
            className={styles.block}
            onClick={() => {
              // onClose();
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <ul role='menu'>
              <li role='menuitem' className={menuItemClassName}>
                <Announcement />
              </li>
              <li role='menuitem' className={menuItemClassName}>
                <Download />
              </li>
            </ul>
          </MotionDiv>
        </LazyMotion>
      )}
    </AnimatePresence>
  );
}
