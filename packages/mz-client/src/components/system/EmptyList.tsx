import styles from '@/styles/EmptyList.module.scss';
import Image from 'next/image';

type Props = {
  message?: string;
};

export default function EmptyList({
  message = '리스트가 비어있습니다.',
}: Props) {
  return (
    <div className={styles.block}>
      <Image
        src={'https://img.mztrees.com/search-not-found.svg'}
        alt='검색 결과가 없음을 나타내는 이미지'
        title='검색 결과가 없습니다. 다시시도 해주세요'
        width='325'
        height='147'
      />
      <span>{message}</span>
    </div>
  );
}
