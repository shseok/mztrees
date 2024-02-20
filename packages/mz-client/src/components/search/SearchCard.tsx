import type { SearchItemResult } from '@/types/db';
import Image from 'next/image';
import styles from '@/styles/SearchCard.module.scss';
import DOMPurify from 'dompurify';
import { Globe } from '@/components/vectors';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import { useGetLinkItemText } from '@/hooks/useGetLinkItemText';

interface Props {
  item: SearchItemResult;
}

const SearchCard = ({ item }: Props) => {
  const {
    publisher: { favicon, name },
    author,
    likes,
    hightlight: { title, body },
  } = item;

  const { mode } = useTheme();
  const sanitizer = DOMPurify.sanitize;
  const link = `/items/${item.id}`;
  const bodyText = useGetLinkItemText(body);

  return (
    <Link
      href={link}
      className={cn(styles.block, mode === 'dark' && styles.dark)}
    >
      <div className={styles.publisher}>
        {favicon ? (
          <figure className={styles.favicon}>
            <Image
              src={favicon}
              alt={`검색된 ${name} 로고 이미지`}
              title={`검색된 ${name}`}
              fill
              sizes='16px'
            />
          </figure>
        ) : (
          <Globe />
        )}
        {author ? `${author} · ` : ''}
        {name}
      </div>
      {/* TODO: Secure this code */}
      <h3
        className={styles.title}
        dangerouslySetInnerHTML={{ __html: sanitizer(title) }}
      />
      <p
        className={styles.body}
        dangerouslySetInnerHTML={{ __html: bodyText }}
      />
      {/* <div className={styles.tag_container}>
        {item.tags.map((tag, index) => (
          <div className={styles.tag} key={index}>
            # {tag}
          </div>
        ))}
      </div> */}
      <div className={styles.likescount}>좋아요 {likes.toLocaleString()}개</div>
    </Link>
  );
};
export default SearchCard;
