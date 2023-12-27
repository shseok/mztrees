'use client';

import { useGifSelector } from '@/context/GifSelectorContext';
import Button from '../system/Button';

const GifSelectButton = () => {
  const { open } = useGifSelector();
  return (
    <>
      <Button
        type='button'
        aria-label='gif 파일 검색 모달창 열기'
        onClick={(e) => {
          e.preventDefault();
          open();
        }}
        variant='warning'
        layoutmode='fullWidth'
      >
        GIF 파일검색
      </Button>
    </>
  );
};

export default GifSelectButton;
