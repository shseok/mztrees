"use client";

import styles from "@/styles/StyledTabLayout.module.scss";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import LinkCardList from "@/components/home/LinkCardList";
import ListModeSelector from "@/components/home/ListModeSelector";
import WeekSelector from "@/components/home/WeekSelector";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useSearchParams } from "next/navigation";
import { getItems } from "@/lib/api/items";
import { ListMode, TagList } from "@/types/db";
import { getWeekRangeFromDate } from "@/lib/week";
import SkeletonUI from "@/components/system/SkeletonUI";
import EmptyList from "../system/EmptyList";
import TabLayout from "../layout/TabLayout";

export default function Home() {
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<ListMode>(
    (searchParams.get("mode") as ListMode | null) ?? "trending"
  );
  const tagsResult = searchParams.getAll("tag") as TagList;
  const [tags, setTags] = useState<TagList>(
    tagsResult.length > 0 ? tagsResult : ["전체"]
  );

  const defaultDateRange = useMemo(() => getWeekRangeFromDate(new Date()), []);
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");
  const [dateRange, setDateRange] = useState(
    startDate && endDate ? [startDate, endDate] : defaultDateRange
  );
  // const [isMobileMode, setIsMobileMode] = useState(false);

  const {
    status,
    data: infiniteData,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    [
      "Items",
      mode,
      tags.join("+"),
      mode === "past" ? dateRange : undefined,
    ].filter((item) => !!item),
    ({ pageParam = undefined }) =>
      getItems({
        mode,
        tags,
        cursor: pageParam,
        ...(mode === "past"
          ? { startDate: dateRange[0], endDate: dateRange[1] }
          : {}),
      }),
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.endCursor;
      },
    }
  );

  const fetchNextData = useCallback(() => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  useInfiniteScroll(observerTargetEl, fetchNextData);

  useEffect(() => {
    const nextMode = (searchParams.get("mode") as ListMode) ?? "trending";
    const tagsResult = searchParams.getAll("tag");
    const nextTag = (tagsResult.length > 0 ? tagsResult : ["전체"]) as TagList;
    if (nextMode !== mode) {
      setMode(nextMode);
    }
    if (nextTag.join("+") !== tags.join("+")) {
      setTags(nextTag);
    }
  }, [searchParams, mode, tags]);

  useEffect(() => {
    if (mode === "past") {
      setDateRange(
        startDate && endDate ? [startDate, endDate] : defaultDateRange
      );
    }
  }, [startDate, endDate, defaultDateRange, mode]);

  // just for responsive design
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (typeof window !== undefined) {
  //       setIsMobileMode(isMobile());
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  const items = infiniteData?.pages.flatMap((page) => page.list);

  return (
    <TabLayout className="layout_padding">
      <div className={styles.content}>
        <ListModeSelector mode={mode} />
        {mode === "past" && <WeekSelector dateRange={dateRange} />}
        {status === "loading" ? (
          <SkeletonUI />
        ) : status === "error" ? (
          // TODO: define error type
          <div>Error: {(error as any).message}</div>
        ) : items ? (
          <LinkCardList items={items} />
        ) : null}
        <div ref={observerTargetEl} />
      </div>
      {items?.length === 0 ? <EmptyList /> : null}
    </TabLayout>
  );
}
