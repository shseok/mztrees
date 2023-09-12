"use client";

import styles from "@/styles/SearchArea.module.scss";
import { useSearchParams } from "next/navigation";
import { Search } from "@/components/vectors";
import useSearchModal from "@/context/SearchModalContext";

const SearchArea = () => {
  const searchParams = useSearchParams();
  const initialKeyword = searchParams.get("q") ?? "궁금한 것을 검색해보세요";
  const { setOpenModal } = useSearchModal();
  const onClick = () => {
    setOpenModal(true);
  };

  return (
    <button className={styles.search_input_wrapper} onClick={onClick}>
      <Search />
      <p>{initialKeyword}</p>
    </button>
  );
};

export default SearchArea;
