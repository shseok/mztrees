"use client";

import DesktopHeader from "@/components/base/DesktopHeader";
import MobileHeader from "@/components/base/MobileHeader";
import TabLayout from "@/components/layout/TabLayout";
import SearchInput from "@/components/search/SearchInput";
import SearchResultCardList from "@/components/search/SearchResultCardList";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { searchItems } from "@/lib/api/search";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { stringify } from "qs";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import Loading from "@/components/system/PostLoading";
import EmptyList from "@/components/system/EmptyList";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default function Search({ searchParams }: Props) {
  const [searchText, setSearchText] = useState(searchParams?.["q"] ?? "");
  const [inputResult] = useDebounce(searchText, 300);
  const observerTargetEl = useRef<HTMLDivElement>(null);
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
      searchItems({ q: inputResult, offset: pageParam }),
    {
      enabled: inputResult.trim() !== "",
      getNextPageParam: (lastPage, allPages) => {
        if (!lastPage.pageInfo.hasNextPage) return undefined;
        return lastPage.pageInfo.nextOffset;
      },
    }
  );
  const fetchNextData = useCallback(() => {
    if (!hasNextPage) return;
    fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  useInfiniteScroll(observerTargetEl, fetchNextData);

  useEffect(() => {
    // console.log("1router.push");
    const query = { q: inputResult };
    const url = `/search${stringify(query, {
      charset: "utf-8",
      encodeValuesOnly: true,
      addQueryPrefix: true,
    })}`;
    router.push(url);
  }, [inputResult, router]);

  // render for desktop search
  useEffect(() => {
    // console.log("2useEffect");
    setSearchText(searchParams?.["q"] ?? "");
  }, [searchParams]);
  const items = infiniteData?.pages.flatMap((page) => page.list);
  return (
    <TabLayout
      header={
        <>
          <MobileHeader
            className="style_mobile_header"
            title={
              <SearchInput value={searchText} onChangeText={setSearchText} />
            }
          />
          <DesktopHeader />
        </>
      }
    >
      {inputResult.trim() !== "" &&
        (status === "loading" ? (
          <Loading />
        ) : status === "error" ? (
          // // TODO: define error type
          <div>Error: {(error as any).message}</div>
        ) : items ? (
          items?.length === 0 ? (
            <EmptyList
              message={`"${searchText}"에 대한 검색결과가 없어요.\n 다른 검색어로 검색을 해보시겠어요?`}
            />
          ) : (
            <SearchResultCardList items={items} />
          )
        ) : null)}
      <div ref={observerTargetEl} />
    </TabLayout>
  );
}
