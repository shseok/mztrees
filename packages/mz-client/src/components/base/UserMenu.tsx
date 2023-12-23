'use client';

import React, { useRef } from 'react';
import { useOnClickOutside } from '@/hooks/useOnClickOuteside';
import { useOpenLogoutDialog } from '@/hooks/useOpenLoginDialog';
import { useRouter } from 'next/navigation';
import styles from '@/styles/UserMenu.module.scss';
import { cn } from '@/utils/common';
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from '@/utils/dynamic';

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
    <div ref={ref}>
      <AnimatePresence initial={false}>
        {visible && (
          <LazyMotion features={loadFeature}>
            <MotionDiv
              className={styles.block}
              onClick={() => {
                onClose();
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.triangle} />
              <div className={styles.triangle_border} />
              <div
                className={cn(styles.menu_item, styles.isDeskTopHidden)}
                onClick={() => router.push('/write')}
              >
                새 글 등록
              </div>
              <div
                className={styles.menu_item}
                onClick={() => router.push('/setting/account')}
              >
                내 계정
              </div>
              <div
                className={styles.menu_item}
                onClick={() => router.push('/bookmark')}
              >
                북마크
              </div>
              <div
                className={styles.menu_item}
                onClick={() => {
                  openLogoutDialog('logout');
                }}
              >
                로그아웃
              </div>
            </MotionDiv>
          </LazyMotion>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
