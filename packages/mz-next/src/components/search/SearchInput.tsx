import React from "react";
import Image from "next/image";
import search from "../../../public/assets/search.svg";
import styles from "@/styles/SearchInput.module.scss";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchInput = ({ value, onChangeText }: Props) => {
  return (
    <div className={styles.block}>
      <Image src={search} alt="search" />
      <input
        placeholder="검색어를 입력해주세요."
        type="text"
        value={value}
        onChange={(e) => {
          onChangeText(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchInput;
