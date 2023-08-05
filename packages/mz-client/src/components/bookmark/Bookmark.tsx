"use client";

import LinkCardList from "@/components/home/LinkCardList";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { getBookmarks } from "@/lib/api/bookmark";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import SkeletonUI from "@/components/system/SkeletonUI";
import styles from "@/styles/StyledTabLayout.module.scss";
import EmptyList from "../system/EmptyList";

export default function Bookmark() {
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

  return (
    <>
      <div className={styles.content} style={{ height: "100%" }}>
        {status === "loading" ? (
          <SkeletonUI />
        ) : status === "error" ? (
          <div>페이지를 로딩중입니다. 잠시만 기다려주세요...</div>
        ) : items ? (
          items.length === 0 ? (
            <EmptyList />
          ) : (
            <LinkCardList items={items} />
          )
        ) : null}
        <div ref={observerTargetEl} />
      </div>
    </>
  );
}
