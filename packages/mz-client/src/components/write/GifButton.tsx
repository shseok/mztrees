'use client';

import { useGifSelector } from '@/context/GifSelectorContext';
import Button from '../system/Button';

const GifSelectButton = () => {
  const { open } = useGifSelector();
  return (
    <>
      <Button
        onClick={(e) => {
          e.preventDefault();
          open();
        }}
        variant='warning'
        layoutmode='fullWidth'
        aria-label='Open gif selector'
      >
        GIF 파일검색
      </Button>
    </>
  );
};

export default GifSelectButton;
