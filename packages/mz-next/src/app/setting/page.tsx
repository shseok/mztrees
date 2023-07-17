import TabLayout from "@/components/layout/TabLayout";
import LogoutTab from "@/components/setting/LogoutTab";
import styles from "@/styles/Setting.module.scss";
import Link from "next/link";

export default function Setting() {
  return (
    <TabLayout>
      <div className={styles.block}>
        <div className={styles.list_wrapper}>
          <Link className={styles.list_item_link} href="/setting/account">
            내 계정
          </Link>
          <LogoutTab />
        </div>
      </div>
    </TabLayout>
  );
}
