'use client';

import { Suspense } from 'react';
import SkeletonUI from '@/components/system/SkeletonUI';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from '@/components/system/ErrorFallback';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import Bookmark from '@/components/bookmark/Bookmark';
import TabLayout from '@/components/layout/TabLayout';

export default function BookmarkPage() {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <TabLayout className='layout_padding'>
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
        <Suspense fallback={<SkeletonUI />}>
          <Bookmark />
        </Suspense>
      </ErrorBoundary>
    </TabLayout>
  );
}
