"use client";

import { FC, useEffect, useState } from "react";
import styles from "@/styles/Announcements.module.scss";
import { cn } from "@/utils/common";
import { Close, Github, Gmail } from "../vectors";

interface AnnouncementsProps {
  fullWidth?: boolean;
}

const Announcements: FC<AnnouncementsProps> = ({ fullWidth = false }) => {
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  const handleGitHubClick = () => {
    const url = "https://github.com/shseok/mztrees/issues";
    window.open(url, "_blank");
  };

  const handleGmailClick = () => {
    window.location.href = "mailto:xyz@gmail.com";
  };

  const setAnnouncementTimeout = () => {
    const now = new Date();
    const item = {
      expiry: now.getTime() + 86400000, // 24 hours from now
    };
    localStorage.setItem("announcement", JSON.stringify(item));
  };

  const checkAnnouncementAvailability = () => {
    const announcementStr = localStorage.getItem("announcement");
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
  };

  return (
    <main className={cn(styles.positioner, fullWidth && styles.fullWidth)}>
      <div className={cn(styles.block)}>
        <section className={cn(styles.title)}>
          <span>공지사항</span>
          <span
            onClick={() => setShowAnnouncement(false)}
            className={cn(styles.closeIcon)}
          >
            <Close />
          </span>
        </section>
        <ul className={cn(styles.body)}>
          <li>
            서비스 이용 중 불편한 점이나 버그를 발견하신 경우, 신고해 주시면
            검토 후 신속하게 답변해 드리겠습니다.
          </li>
          <li>
            원하는 게시물에 태그가 없고, 태그를 추가하고 싶다면 아래 아이콘을
            클릭하여 이용해주세요.
          </li>
        </ul>
        <section className={cn(styles.bottom)}>
          <div className={cn(styles.iconWrapper)}>
            <Gmail onClick={handleGmailClick} />{" "}
            <Github onClick={handleGitHubClick} />
          </div>
          <div className={cn(styles.checkbox)}>
            오늘은 시청을 중지하세요.
            <input
              type="checkbox"
              onChange={handleClose}
              className={cn(styles.checkInput)}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default Announcements;
