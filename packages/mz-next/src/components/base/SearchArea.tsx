"use client";

import React, { useRef } from "react";
import Image from "next/image";
import search from "../../../public/assets/search.svg";
import styles from "@/styles/SearchArea.module.scss";
import { useRouter, useSearchParams } from "next/navigation";

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
        <Image src={search} alt="search" />
        <input ref={ref} type="text" defaultValue={initialKeyword} />
      </div>
    </div>
  );
};

export default SearchArea;
