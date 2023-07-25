"use client";

import { Suspense } from "react";
import SkeletonUI from "@/components/system/SkeletonUI";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/system/ErrorFallback";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import Bookmark from "@/components/bookmark/Bookmark";

export default function BookmarkPage() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
      <Suspense fallback={<SkeletonUI />}>
        <Bookmark />
      </Suspense>
    </ErrorBoundary>
  );
}
