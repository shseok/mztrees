import React from "react";
import styles from "@/styles/gif/Gif.module.scss";

interface Props {
  url: string;
}

const Gif = ({ url }: Props) => (
  <li className={styles.gif_wrap}>
    <img src={url} alt="" />
  </li>
);

export default Gif;
