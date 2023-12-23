import React from 'react';
import styles from '@/styles/gif/Gif.module.scss';
import { cn } from '@/utils/common';
import Image from 'next/image';

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
    <Image src={url} alt={url} fill sizes='200px' />
  </li>
);

export default Gif;
