"use client";

import { useRef } from "react";
import styles from "@/styles/SearchArea.module.scss";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "@/components/vectors";

const SearchArea = () => {
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("q") ?? "";

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      router.push(`/search?q=${ref.current?.value}`);
    }
  };
  const onClick = () => {
    ref.current?.focus();
  };

  return (
    <div className={styles.block}>
      <div
        className={styles.search_input_wrapper}
        onClick={onClick}
        onKeyUp={onKeyUp}
      >
        <Search />
        <input ref={ref} type="text" defaultValue={initialKeyword} />
      </div>
    </div>
  );
};

export default SearchArea;
