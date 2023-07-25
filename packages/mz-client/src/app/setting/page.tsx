"use client";

import TabLayout from "@/components/layout/TabLayout";
import { useTheme } from "@/context/ThemeContext";
import { useLogout } from "@/hooks/useLogout";
import styles from "@/styles/Setting.module.scss";
import { cn } from "@/utils/common";
import Link from "next/link";

export const metadata = {
  title: "설정",
  robots: "noindex",
};

export default function Setting() {
  const logout = useLogout();
  const { mode } = useTheme();
  return (
    <TabLayout>
      <div className={cn(styles.block, mode === "dark" && styles.dark)}>
        <div className={styles.list_wrapper}>
          <Link
            className={cn(
              styles.list_item_link,
              mode === "dark" && styles.dark
            )}
            href="/setting/account"
          >
            내 계정
          </Link>
          <div
            className={cn(
              styles.list_item_link,
              mode === "dark" && styles.dark
            )}
            onClick={logout}
          >
            로그아웃
          </div>
        </div>
      </div>
    </TabLayout>
  );
}
