"use client";

import LinkCardList from "@/components/home/LinkCardList";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getBookmarks } from "@/lib/api/bookmark";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import SkeletonUI from "@/components/system/SkeletonUI";

export default function Bookmark() {
  console.log("bookmark");
  // const router = useRouter();
  // const openLoginDialog = useOpenLoginDialog();
  const observerTargetEl = useRef<HTMLDivElement>(null);

  const {
    status,
    data,
    fetchNextPage,

    hasNextPage,
  } = useInfiniteQuery(
    ["bookmarks"],
    ({ pageParam = undefined }) => getBookmarks(pageParam),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.endCursor;
      },
      suspense: true,
      useErrorBoundary: true,
    }
  );

  const fetchNextData = useCallback(() => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  useInfiniteScroll(observerTargetEl, fetchNextData);

  const items = data?.pages
    .flatMap((page) => page.list)
    .map((page) => page.item);

  // if (isError) {
  //   console.log("젭라", isError, e);
  //   const error = extractNextError(e);
  //   if (error.name === "Unauthorized" && error.payload?.isExpiredToken) {
  //     // refresh token
  //     console.log("페이지 리프레쉬 ");
  //     router.refresh();
  //   } else {
  //     openLoginDialog("sessionOut");
  //   }
  //   console.log(extractNextError(e));
  // }

  return (
    <>
      {status === "loading" ? (
        <SkeletonUI />
      ) : status === "error" ? (
        <div>에러</div>
      ) : items ? (
        <LinkCardList items={items} />
      ) : null}
      <div ref={observerTargetEl} />
    </>
  );
}
