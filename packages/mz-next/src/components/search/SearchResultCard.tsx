import React from "react";
import { SearchItemResult } from "@/lib/api/types";
import Image from "next/image";
import globe from "../../../public/assets/globe.svg";
import styles from "@/styles/SearchResultCard.module.scss";
import DOMPurify from "dompurify";

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
          <Image src={favicon} alt="favicon" />
        ) : (
          <Image src={globe} alt="globe" />
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
