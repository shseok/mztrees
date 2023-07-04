"use client";

import DesktopHeader from "@/components/base/DesktopHeader";
import MobileHeader from "@/components/base/MobileHeader";
import TabLayout from "@/components/layout/TabLayout";
import SearchInput from "@/components/search/SearchInput";
import styles from "@/styles/Search.module.scss";
import { useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Search({ searchParams }: Props) {
  const [searchText, setSearchText] = useState(searchParams?.["q"] ?? "");
  const [inputResult] = useDebounce(searchText, 300);
  const observerTargetEl = useRef<HTMLDivElement>(null);

  console.log("search");
  console.log(inputResult);
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
      Search
    </TabLayout>
  );
}
