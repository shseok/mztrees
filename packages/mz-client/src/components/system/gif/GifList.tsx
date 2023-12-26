import React from 'react';
import Gif from './Gif';
import NoGifs from './NoGifs';
import styles from '@/styles/gif/GifList.module.scss';
import type { GIFObject } from '@/types/custom';

interface Props {
  data: GIFObject[];
  selected: string;
  handleClick: (url: string) => void;
}

const GifList = ({ data: results, selected, handleClick }: Props) => {
  console.log(results);
  let gifs;
  if (results.length) {
    gifs = results.map((gif) => (
      <Gif
        url={gif.images.fixed_height.url}
        key={gif.id}
        title={gif.title}
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
