"use client";

import DesktopHeader from "@/components/base/DesktopHeader";
import MobileHeader from "@/components/base/MobileHeader";
import TabLayout from "@/components/layout/TabLayout";
import SearchInput from "@/components/search/SearchInput";
import SearchResultCardList from "@/components/search/SearchResultCardList";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { searchItems } from "@/lib/api/search";
import styles from "@/styles/Search.module.scss";
import getQueryClient from "@/utils/getQueryClient";
import Hydrate from "@/utils/hydrate.client";
import { dehydrate, useInfiniteQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { stringify } from "qs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Search({ searchParams }: Props) {
  const searchparams = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams?.["q"] ?? "");
  const [inputResult] = useDebounce(searchText as string, 300);
  const observerTargetEl = useRef<HTMLDivElement>(null);

  // const queryClient = getQueryClient();
  // const dehydratedState = dehydrate(queryClient);
  console.log("search", searchText, inputResult, searchparams);
  // await queryClient.prefetchInfiniteQuery(["searchItems"], () => searchItems());
  const router = useRouter();

  const {
    status,
    data: infiniteData,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    ["searchItems", inputResult],
    ({ pageParam = undefined }) =>
      searchItems({ q: encodeURIComponent(inputResult), offset: pageParam }),
    {
      enabled: inputResult.trim() !== "",
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.nextOffset;
      },
    }
  );
  // console.log(inputResult, searchText, searchParams.get('q'));
  const fetchNextData = useCallback(() => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  useInfiniteScroll(observerTargetEl, fetchNextData);

  useEffect(() => {
    router.push(`/search?${stringify({ q: inputResult })}`);
  }, [inputResult, router]);

  return (
    <TabLayout
      header={
        <>
          <MobileHeader
            className={styles.style_mobile_header}
            title={
              <SearchInput
                value={searchText as string}
                onChangeText={setSearchText}
              />
            }
          />
          <DesktopHeader />
        </>
      }
    >
      {inputResult.trim() !== "" &&
        (status === "loading" ? (
          <div>Loading...</div>
        ) : status === "error" ? (
          // // TODO: define error type
          <div>Error: {(error as any).message}</div>
        ) : (
          <>
            <SearchResultCardList
              items={infiniteData.pages.flatMap((page) => page.list) ?? []}
            />
          </>
        ))}
      <div ref={observerTargetEl} />
      {/* <Hydrate state={dehydratedState}>Search</Hydrate> */}
    </TabLayout>
  );
}
