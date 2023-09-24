import React from "react";
import Gif from "./Gif";
import NoGifs from "./NoGifs";
import styles from "@/styles/gif/GifList.module.scss";

interface Props {
  data: any[];
  selected: string;
  handleClick: (url: string) => void;
}

const GifList = ({ data, selected, handleClick }: Props) => {
  const results = data;
  let gifs;
  if (results.length) {
    gifs = results.map((gif) => (
      <Gif
        url={gif.images.fixed_height.url}
        key={gif.id}
        selected={selected}
        handleClick={handleClick}
      />
    ));
  } else {
    gifs = <NoGifs />;
  }

  return <ul className={styles.gif_list}>{gifs}</ul>;
};

export default GifList;
