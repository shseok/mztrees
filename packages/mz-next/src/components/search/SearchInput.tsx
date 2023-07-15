import React from "react";
import styles from "@/styles/SearchInput.module.scss";
import { Search } from "@/components/vectors";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchInput = ({ value, onChangeText }: Props) => {
  return (
    <div className={styles.block}>
      <Search />
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
