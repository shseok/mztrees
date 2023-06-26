import React from "react";

import Image from "next/image";
import likeOutline from "../../../public/assets/like-outline.svg";
import likeFill from "../../../public/assets/like-fill.svg";
import styles from "@/styles/LikeButton.module.scss";
import IconToggleButton from "./IconToggleButton";
import { Size } from "@/lib/api/types";

interface Props {
  onClick: () => void;
  isLiked: boolean;
  size?: Size;
}

const LikeButton = ({ onClick, isLiked, size = "medium" }: Props) => {
  return (
    <IconToggleButton
      onClick={onClick}
      isActive={isLiked}
      size={size}
      activeIcon={
        <Image
          className={styles.styled_like_fill}
          src={likeFill}
          alt="like"
          key="fill"
        />
      }
      inactiveIcon={
        <Image
          className={styles.styled_like_outline}
          src={likeOutline}
          alt="like"
          key="outline"
        />
      }
    />
  );
};

export default LikeButton;
