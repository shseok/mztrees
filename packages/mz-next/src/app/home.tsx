"use client";

import TabLayout from "@/components/layout/TabLayout";
import styles from "@/styles/Home.module.scss";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
import { ListMode } from "@/lib/api/types";
// import { getMyAccountWithRefresh } from "@/lib/protectRoute";
import { getWeekRangeFromDate } from "@/lib/week";
import useSetSearchParams from "@/hooks/useSetSearchParams";

// export default function Home({searchParams}) {
export default function Home() {
  const observerTargetEl = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const setSearchParams = useSetSearchParams();
  // console.log(searchParams);
  const [mode, setMode] = useState<ListMode>(
    (searchParams.get("mode") as ListMode | null) ?? "trending"
  );

  const defaultDateRange = useMemo(() => getWeekRangeFromDate(new Date()), []);
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");
  const [dateRange, setDateRange] = useState(
    startDate && endDate ? [startDate, endDate] : defaultDateRange
  );

  // const {
  //   status,
  //   data: infiniteData,
  //   error,
  //   fetchNextPage,
  //   hasNextPage,
  // } = useInfiniteQuery(
  //   ["Items", mode, mode === "past" ? dateRange : undefined].filter(
  //     (item) => !!item
  //   ),
  //   ({ pageParam = undefined }) =>
  //     getItems({
  //       mode,
  //       cursor: pageParam,
  //       ...(mode === "past"
  //         ? { startDate: dateRange[0], endDate: dateRange[1] }
  //         : {}),
  //     }),
  //   {
  //     getNextPageParam: (lastPage) => {
  //       if (!lastPage.pageInfo.hasNextPage) return undefined;
  //       return lastPage.pageInfo.endCursor;
  //     },
  //   }
  // );

  // const fetchNextData = useCallback(() => {
  //   if (!hasNextPage) return;
  //   fetchNextPage();
  // }, [hasNextPage]);

  // useInfiniteScroll(observerTargetEl, fetchNextData);

  // const { data, isLoading, isFetching, error, status } = useQuery({
  //   queryKey: ["items"],
  //   queryFn: () => getItems({ mode: "recent" }),
  // });

  // const data = await getItems({ mode: "recent" });

  const onselect = (mode: ListMode) => {
    setSearchParams({ mode });
  };

  // useEffect(() => {
  //   const nextMode = (searchParams.get("mode") as ListMode) ?? "trending";
  //   if (nextMode !== mode) {
  //     setMode(nextMode);
  //   }
  // }, [searchParams, mode]);

  // useEffect(() => {
  //   if (mode === "past") {
  //     setDateRange(
  //       startDate && endDate ? [startDate, endDate] : defaultDateRange
  //     );
  //   }
  // }, [startDate, endDate, defaultDateRange, mode]);

  // if (typeof window !== 'undefined') {
  //   (window as any).queryClient = useQueryClient();
  // }

  // TODO: Remove with SSR
  // getMyAccountWithRefresh();

  return (
    <TabLayout className={styles.layout_padding}>
      <ListModeSelector mode={mode} onSelectMode={onselect} />
      {mode === "past" && <WeekSelector dateRange={dateRange} />}
      {/* TODO: make loading */}
      {/* {status === "loading" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        // TODO: define error type
        <div>Error: {(error as any).message}</div>
      ) : (
        <div className={styles.content}>
          <LinkCardList
            // items={infiniteData.pages.flatMap((page) => page.list)}
            items={data.list}
          />
          <div ref={observerTargetEl} />
        </div>
      )} */}
      <div className={styles.content}>
        {/* <LinkCardList
          // items={infiniteData.pages.flatMap((page) => page.list)}
          items={data.list}
        /> */}
        <div ref={observerTargetEl} />
      </div>
    </TabLayout>
  );
}
