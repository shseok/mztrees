"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOuteside";
import { useOpenLogoutDialog } from "@/hooks/useOpenLoginDialog";
import { useRouter } from "next/navigation";
import styles from "@/styles/UserMenu.module.scss";
import { cn } from "@/utils/common";

interface Props {
  visible: boolean;
  onClose: (e?: Event) => void;
}

const UserMenu = ({ visible, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  useOnClickOutside(ref, (e) => {
    onClose(e);
  });
  const openLogoutDialog = useOpenLogoutDialog();
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          className={styles.block}
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
          <div
            className={cn(styles.menu_item, styles.isDeskTopHidden)}
            onClick={() => router.push("/write")}
          >
            새 글 등록
          </div>
          <div
            className={styles.menu_item}
            onClick={() => router.push("/setting/account")}
          >
            내 계정
          </div>
          <div
            className={styles.menu_item}
            onClick={() => router.push("/bookmark")}
          >
            북마크
          </div>
          <div
            className={styles.menu_item}
            onClick={() => {
              openLogoutDialog("logout");
            }}
          >
            로그아웃
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserMenu;
