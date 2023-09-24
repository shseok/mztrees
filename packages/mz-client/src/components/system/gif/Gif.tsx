import React from "react";
import styles from "@/styles/gif/Gif.module.scss";
import { cn } from "@/utils/common";

interface Props {
  url: string;
  selected: string;
  handleClick: (url: string) => void;
}

const Gif = ({ url, selected, handleClick }: Props) => (
  <li
    className={cn(styles.gif_wrap, selected === url && styles.active)}
    onClick={() => handleClick(url)}
  >
    <img src={url} alt={url} />
  </li>
);

export default Gif;
