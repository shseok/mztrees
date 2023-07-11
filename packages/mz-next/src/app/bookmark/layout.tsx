"use client";

import TabLayout from "@/components/layout/TabLayout";
import { useProtectedRoute } from "@/lib/protectRoute";
import styles from "@/styles/StyledTabLayout.module.scss";
import { Suspense } from "react";
import SkeletonUI from "@/components/system/SkeletonUI";

export const metadata = {
  title: "bookmark",
  description: "Generated by create next app",
};

export default function BookmarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const queryClient = getQueryClient();
  // const dehydratedState = dehydrate(queryClient);
  // await queryClient.prefetchInfiniteQuery(["bookmarks"], () => getBookmarks());

  const hasPermission = useProtectedRoute();

  if (!hasPermission) {
    // TODO: 인가 관련 에러처리해주기 (react-tostify)
    return null;
  }

  return (
    // <Hydrate state={dehydratedState}>
    <TabLayout className={styles.layout_padding}>
      <div className={styles.content}>
        <Suspense fallback={<SkeletonUI />}>{children}</Suspense>
      </div>
    </TabLayout>
    // </Hydrate>
  );
}
