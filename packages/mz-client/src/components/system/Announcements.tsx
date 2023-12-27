'use client';

import { FC, useEffect, useState } from 'react';
import styles from '@/styles/Announcements.module.scss';
import { cn } from '@/utils/common';
import { Close, Github, Gmail } from '../vectors';

interface AnnouncementsProps {
  fullWidth?: boolean;
}

const Announcements: FC<AnnouncementsProps> = ({ fullWidth = false }) => {
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  const handleGitHubClick = () => {
    const url = 'https://github.com/shseok/mztrees/issues';
    window.open(url, '_blank');
  };

  const handleGmailClick = () => {
    window.location.href = 'mailto:shseok0674@gmail.com';
  };

  const setAnnouncementTimeout = () => {
    const now = new Date();
    const item = {
      expiry: now.getTime() + 86400000, // 24 hours from now
    };
    localStorage.setItem('announcement', JSON.stringify(item));
  };

  const checkAnnouncementAvailability = () => {
    const announcementStr = localStorage.getItem('announcement');
    if (!announcementStr) {
      setShowAnnouncement(true);
      return;
    }
    const announcement = JSON.parse(announcementStr);
    const now = new Date();

    if (now.getTime() > announcement.expiry) {
      setShowAnnouncement(true);
    } else {
      setShowAnnouncement(false);
    }
  };

  useEffect(() => {
    checkAnnouncementAvailability();
  }, []);

  if (!showAnnouncement) return null;

  const handleClose = () => {
    setAnnouncementTimeout();
    setShowAnnouncement(false);
  };

  return (
    <section
      className={cn(styles.positioner, fullWidth && styles.fullWidth)}
      role='alert'
    >
      <div className={styles.block}>
        <div className={styles.title}>
          <span>공지사항</span>
          <button
            type='button'
            aria-label='공지사항 닫기'
            onClick={() => setShowAnnouncement(false)}
            className={styles.closeIcon}
          >
            <Close />
          </button>
        </div>
        <ul className={styles.body}>
          <li>
            &bull; 서비스 이용 중 <span>불편한 점</span>이나{' '}
            <span>버그를 발견</span>
            하신 경우, 신고해 주시면 검토 후 신속하게 답변해 드리겠습니다.
          </li>
          <li>
            &bull; 원하는 게시물에 태그가 없고, <span>태그를 추가</span>하고
            싶다면 아래 아이콘을 클릭하여 요청해주세요.
          </li>
        </ul>
        <div className={styles.bottom}>
          <div className={styles.iconWrapper}>
            <Gmail onClick={handleGmailClick} />
            <Github onClick={handleGitHubClick} />
          </div>
          <div className={styles.checkbox}>
            <label>
              오늘 하루 그만 보기
              <input
                type='checkbox'
                onChange={handleClose}
                className={styles.checkInput}
              />
            </label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Announcements;
