import React from 'react';
import styles from '@/styles/gif/Gif.module.scss';
import { cn } from '@/utils/common';
import Image from 'next/image';

interface Props {
  url: string;
  selected: string;
  title: string;
  handleClick: (url: string) => void;
}

const Gif = ({ url, title, selected, handleClick }: Props) => (
  <li
    className={cn(styles.gif_wrap, selected === url && styles.active)}
    onClick={() => handleClick(url)}
  >
    <Image
      src={url}
      alt={title}
      title={`${title}-giphy api를 통해 추출된 검색결과에 해당하는 각 gif 이미지 파일`}
      fill
      sizes='200px'
    />
  </li>
);

export default Gif;
