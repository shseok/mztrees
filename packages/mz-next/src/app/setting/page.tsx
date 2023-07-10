"use client";

import TabLayout from "@/components/layout/TabLayout";
import { useLogout } from "@/hooks/useLogout";
import { useProtectedRoute } from "@/lib/protectRoute";
import styles from "@/styles/Setting.module.scss";
import Link from "next/link";

export default function Setting() {
  const logout = useLogout();
  const hasPermission = useProtectedRoute();

  if (!hasPermission) {
    // TODO: 인가 관련 에러처리해주기 (react-tostify)
    return null;
  }
  return (
    <TabLayout>
      <div className={styles.block}>
        <div className={styles.list_wrapper}>
          <Link className={styles.list_item_link} href="/setting/account">
            내 계정
          </Link>
          <div className={styles.list_item} onClick={logout}>
            로그아웃
          </div>
        </div>
      </div>
    </TabLayout>
  );
}
