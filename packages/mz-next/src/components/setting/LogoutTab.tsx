"use client";

import { useLogout } from "@/hooks/useLogout";
import styles from "@/styles/LogoutTab.module.scss";

const LogoutTab = () => {
  const logout = useLogout();
  return (
    <div className={styles.list_item} onClick={logout}>
      로그아웃
    </div>
  );
};

export default LogoutTab;
