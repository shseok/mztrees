import { SearchItemResult } from '@/types/db';
import SearchResultCard from './SearchResultCard';
import styles from '@/styles/SearchResultCardList.module.scss';

interface Props {
  items: SearchItemResult[];
  searchText: string;
}

const SearchResultCardList = ({ items, searchText }: Props) => {
  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <h2 className={styles.title}>{`'${searchText}'에 대한 검색 결과`}</h2>
        <p className={styles.count}>
          총 <strong>{`${items.length}개`}</strong>의 포스트가 검색되었습니다.
        </p>
      </div>
      {items.map((item) => (
        <SearchResultCard item={item} key={item.id} />
      ))}
    </div>
  );
};
export default SearchResultCardList;
