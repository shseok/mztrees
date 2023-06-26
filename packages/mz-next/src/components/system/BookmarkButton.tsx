import React from "react";
import { Size } from "@/lib/api/types";
import IconToggleButton from "./IconToggleButton";

import Image from "next/image";
import bookmarkOutline from "../../../public/assets/bookmark-outline.svg";
import bookmarkFill from "../../../public/assets/bookmark-fill.svg";
import styles from "@/styles/CommentItem.module.scss";

interface Props {
  onClick: () => void;
  isBookmarked: boolean;
  size?: Size;
}

const BookmarkButton = ({ onClick, isBookmarked, size = "medium" }: Props) => {
  return (
    <IconToggleButton
      onClick={onClick}
      isActive={isBookmarked}
      size={size}
      activeIcon={
        <Image
          className={styles.styled_like_fill}
          src={bookmarkFill}
          alt="bookmark"
          key="fill"
        />
      }
      inactiveIcon={
        <Image
          className={styles.styled_like_outline}
          src={bookmarkOutline}
          alt="bookmark"
          key="outline"
        />
      }
    />
  );
};

export default BookmarkButton;
