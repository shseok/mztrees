import React, { useState } from 'react';
import styles from '@/styles/LoadMore.module.scss';
import Button from '../system/Button';
import InfiniteScrollSection from './InfiniteScrollSection';

type Props = {
  moreItemCount: number;
  endItemId?: number;
};

export default function LoadMore({ moreItemCount, endItemId }: Props) {
  // toggle load more button
  const [isMore, setIsMore] = useState(false);
  const handleClick = () => {
    setIsMore(!isMore);
  };
  return (
    <>
      {!isMore && (
        <section className={styles.container}>
          <Button
            type='button'
            aria-label='방문하기'
            variant='visit'
            onClick={handleClick}
          >
            <span>{`더 많은 글 보기 +${moreItemCount}`}</span>
          </Button>
        </section>
      )}
      {isMore && <InfiniteScrollSection endItemId={endItemId} />}
    </>
  );
}
