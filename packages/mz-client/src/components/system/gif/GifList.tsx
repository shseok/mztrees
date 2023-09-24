import React from "react";
import Gif from "./Gif";
import NoGifs from "./NoGifs";
import styles from "@/styles/gif/GifList.module.scss";

interface Props {
  data: any[];
}

const GifList = ({ data }: Props) => {
  const results = data;
  let gifs;
  if (results.length) {
    gifs = results.map((gif) => (
      <Gif url={gif.images.fixed_height.url} key={gif.id} />
    ));
  } else {
    gifs = <NoGifs />;
  }

  return <ul className={styles.gif_list}>{gifs}</ul>;
};

export default GifList;
