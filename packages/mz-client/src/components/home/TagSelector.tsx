import React, { useRef, useState } from "react";
import styles from "@/styles/TagSelector.module.scss";
import { ChevronDown, ChevronUp } from "../vectors";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/common";
import TagMenu from "./TagMenu";
import { ListMode, Tag } from "@/types/db";

interface Props {
  listMode: ListMode;
  selectedTag: Tag | null;
  setSelectedTag: (tag: Tag) => void;
}

const TagSelector = ({ listMode, selectedTag, setSelectedTag }: Props) => {
  const { mode } = useTheme();
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // const searchParams = useSearchParams();
  const onToggle = () => {
    setVisible(!visible);
  };
  const onClose = (e?: Event) => {
    const buttonEl = buttonRef?.current;
    const isButton =
      buttonEl === e?.target || buttonEl?.contains(e?.target as Node);
    if (isButton) return;

    setVisible(false);
  };

  return (
    <div className={cn(styles.container, mode === "dark" && styles.dark)}>
      <button
        className={styles.inner_container}
        onClick={onToggle}
        ref={buttonRef}
      >
        <span>태그 목록</span>
        {visible ? <ChevronUp /> : <ChevronDown />}
      </button>
      <TagMenu
        listMode={listMode}
        visible={visible}
        onClose={onClose}
        selected={selectedTag}
        onSelect={(
          e: React.MouseEvent<HTMLLIElement, MouseEvent>,
          value: Tag
        ) => {
          e.preventDefault();
          // const nextTag = (searchParams.get("tag") as Tag) ?? "전체";
          setSelectedTag(value);
          // if (nextTag !== tag) {
          //   setTag(nextTag);
          // }
        }}
      />
    </div>
  );
};

export default TagSelector;
