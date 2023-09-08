import React from "react";
import styles from "@/styles/TagSelector.module.scss";
import { ChevronDown } from "../vectors";

const TagSelector = () => {
  return (
    <div className={styles.container}>
      <button className={styles.inner_container}>
        <span>태그 목록</span>
        <ChevronDown />
      </button>
    </div>
  );
};

export default TagSelector;
