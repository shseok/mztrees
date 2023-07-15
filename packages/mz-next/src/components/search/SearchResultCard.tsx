import { SearchItemResult } from "@/types/db";
import Image from "next/image";
import styles from "@/styles/SearchResultCard.module.scss";
import DOMPurify from "dompurify";
import { Globe } from "@/utils/vectors";

interface Props {
  item: SearchItemResult;
}

const SearchResultCard = ({ item }: Props) => {
  const {
    publisher: { favicon, name },
    author,
    likes,
    hightlight: { title, body },
  } = item;

  const sanitizer = DOMPurify.sanitize;

  return (
    <div className={styles.block}>
      <div className={styles.publisher}>
        {favicon ? (
          <div className={styles.favicon}>
            <Image src={favicon} alt="favicon" fill />
          </div>
        ) : (
          <Globe />
        )}
        {author ? `${author} · ` : ""}
        {name}
      </div>
      {/* TODO: Secure this code */}
      <h3
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: sanitizer(title) }}
      />
      <p
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: sanitizer(body) }}
      />
      <div className={styles.likescount}>좋아요 {likes.toLocaleString()}개</div>
    </div>
  );
};
export default SearchResultCard;
