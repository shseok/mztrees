import type { SearchItemResult } from '@/types/db';
import SearchCard from './SearchCard';
import styles from '@/styles/SearchCardList.module.scss';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';

interface Props {
  items: SearchItemResult[];
  searchText: string;
}

const SearchCardList = ({ items, searchText }: Props) => {
  const { mode } = useTheme();
  return (
    <div className={cn(styles.block, mode === 'dark' && styles.dark)}>
      <div className={styles.header}>
        <h2 className={styles.title}>{`'${searchText}'에 대한 검색 결과`}</h2>
        <p className={styles.count}>
          총 <strong>{`${items.length}개`}</strong>의 포스트가 검색되었습니다.
        </p>
      </div>
      {items.map((item) => (
        <SearchCard item={item} key={item.id} />
      ))}
    </div>
  );
};
export default SearchCardList;
