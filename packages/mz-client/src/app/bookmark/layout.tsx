"use client";

import TabLayout from "@/components/layout/TabLayout";
import styles from "@/styles/StyledTabLayout.module.scss";
import { Suspense } from "react";
import SkeletonUI from "@/components/system/SkeletonUI";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import ErrorFallback from "@/components/system/ErrorFallback";

export const metadata = {
  title: "북마크",
  robots: "noindex",
};

export default function BookmarkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <TabLayout className="layout_padding">
      <div className={styles.content} style={{ height: "100%" }}>
        <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
          <Suspense fallback={<SkeletonUI />}>{children}</Suspense>
        </ErrorBoundary>
      </div>
    </TabLayout>
  );
}
