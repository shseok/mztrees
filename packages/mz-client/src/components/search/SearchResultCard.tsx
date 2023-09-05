import { SearchItemResult } from "@/types/db";
import Image from "next/image";
import styles from "@/styles/SearchResultCard.module.scss";
import DOMPurify from "dompurify";
import { Globe } from "@/components/vectors";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/common";

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

  const { mode } = useTheme();
  const sanitizer = DOMPurify.sanitize;
  const link = `/items/${item.id}`;

  return (
    <Link
      href={link}
      className={cn(styles.block, mode === "dark" && styles.dark)}
    >
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
    </Link>
  );
};
export default SearchResultCard;
