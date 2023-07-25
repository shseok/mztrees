import TabLayout from "@/components/layout/TabLayout";
import styles from "@/styles/StyledTabLayout.module.scss";

export const metadata = {
  title: "북마크",
  robots: "noindex",
};

export default function BookmarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TabLayout className="layout_padding">
      <div className={styles.content} style={{ height: "100%" }}>
        {children}
      </div>
    </TabLayout>
  );
}
