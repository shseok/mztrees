"use client";

import styles from "@/styles/StyledTabLayout.module.scss";
import {
  useInfiniteQuery,
  useQueryErrorResetBoundary,
} from "@tanstack/react-query";
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
import { ListMode, Tag } from "@/types/db";
import { getWeekRangeFromDate } from "@/lib/week";
import SkeletonUI from "@/components/system/SkeletonUI";
import EmptyList from "../system/EmptyList";
import TabLayout from "../layout/TabLayout";
import TagSelector from "./TagSelector";
import Error from "@/app/error";
import BackgroundContent from "./BackgroundContent";

export default function Home() {
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<ListMode>(
    (searchParams.get("mode") as ListMode | null) ?? "trending"
  );
  const [tag, setTag] = useState<Tag | null>(
    searchParams.get("tag") as Tag | null
  );

  const defaultDateRange = useMemo(() => getWeekRangeFromDate(new Date()), []);
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");
  const [dateRange, setDateRange] = useState(
    startDate && endDate ? [startDate, endDate] : defaultDateRange
  );
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { reset } = useQueryErrorResetBoundary();

  const {
    status,
    data: infiniteData,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["Items", mode, tag, mode === "past" ? dateRange : undefined].filter(
      (item) => !!item
    ),
    ({ pageParam = undefined }) =>
      getItems({
        mode,
        tag: tag ?? undefined,
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
    if (nextMode !== mode) {
      setMode(nextMode);
    }
  }, [searchParams, mode]);

  useEffect(() => {
    if (mode === "past") {
      setDateRange(
        startDate && endDate ? [startDate, endDate] : defaultDateRange
      );
    }
  }, [startDate, endDate, defaultDateRange, mode]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const items = infiniteData?.pages.flatMap((page) => page.list);
  return (
    <TabLayout className="layout_padding">
      {/* <Ball x={mousePosition.x} y={mousePosition.y} /> */}
      <BackgroundContent x={mousePosition.x} y={mousePosition.y} />
      <div className={styles.content}>
        <ListModeSelector mode={mode} tag={tag} />
        <TagSelector
          listMode={mode}
          selectedTag={tag}
          setSelectedTag={setTag}
        />
        {mode === "past" && <WeekSelector dateRange={dateRange} />}
        {status === "loading" ? (
          <SkeletonUI />
        ) : status === "error" ? (
          // TODO: define error type
          <Error error={error as Error} reset={reset} />
        ) : items ? (
          <LinkCardList items={items} />
        ) : null}
        <div ref={observerTargetEl} />
      </div>
      {items?.length === 0 ? <EmptyList /> : null}
    </TabLayout>
  );
}
