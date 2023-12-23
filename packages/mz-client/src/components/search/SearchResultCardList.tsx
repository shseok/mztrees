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
      <h2
        className={styles.search_text}
      >{`'${searchText}'에 대한 검색 결과`}</h2>
      {items.map((item) => (
        <SearchResultCard item={item} key={item.id} />
      ))}
    </div>
  );
};
export default SearchResultCardList;
