import { useEffect, useState } from 'react';
import { useDialog } from '@/context/DialogContext';
import styles from '@/styles/ExpandableActionMenu.module.scss';
import { Announcement, Download } from '@/components/vectors';
import { useTheme } from '@/context/ThemeContext';
import { toast } from 'sonner';
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from '@/utils/dynamic';
import { cn } from '@/utils/common';

interface Props {
  visible: boolean;
  close: () => void;
}

export default function ExpandableActionMenu({ visible, close }: Props) {
  const { mode } = useTheme();
  const menuItemClassName = cn(
    styles.menu_item,
    mode === 'dark' && styles.dark_mode
  );
  const { open } = useDialog();
  const openPwaInstallDialog = () => {
    close();
    open({
      title: '앱 설치',
      description: '앱 설치를 하시겠습니까?',
      confirmText: '설치',
      cancelText: '취소',
      onConfirm: handleInstallClick,
      onClose: handleInstallCancel,
      mode: 'confirm',
    });
  };

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const handleInstallClick = async () => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      toast.error('이미 설치가 되어 있습니다.');
      return;
    }
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcom } = await deferredPrompt.userChoice;
      if (outcom !== 'accepted') {
        toast.error(
          '설치가 취소되었습니다. 설치를 원하시는 경우 브라우저 상단 검색창에서 모니터 아이콘을 눌러 설치를 진행해주세요.'
        );
      }
      setDeferredPrompt(null);
    } else {
      toast.error(
        '설치를 원하시는 경우 브라우저 상단 검색창에서 모니터 아이콘을 눌러 설치를 진행해주세요.'
      );
    }
  };
  const handleInstallCancel = () => {
    setDeferredPrompt(null);
  };

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: any) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

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
              <li
                role='menuitem'
                className={menuItemClassName}
                onClick={openPwaInstallDialog}
              >
                <Download />
              </li>
            </ul>
          </MotionDiv>
        </LazyMotion>
      )}
    </AnimatePresence>
  );
}
