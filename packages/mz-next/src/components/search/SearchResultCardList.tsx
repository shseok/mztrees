import { SearchItemResult } from "@/lib/api/types";
import SearchResultCard from "./SearchResultCard";
import styles from "@/styles/SearchResultCardList.module.scss";

interface Props {
  items: SearchItemResult[];
}

const SearchResultCardList = ({ items }: Props) => {
  return (
    <div className={styles.block}>
      {items.map((item) => (
        <SearchResultCard item={item} key={item.id} />
      ))}
    </div>
  );
};
export default SearchResultCardList;
