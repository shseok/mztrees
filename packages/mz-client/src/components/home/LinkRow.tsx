import type { Item } from '@/types/db';
import styles from '@/styles/LinkRow.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import { useDateDistance } from '@/hooks/useDateDistance';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { blurDataUrl } from '@/lib/const';
import { cn } from '@/utils/common';
import { Chat, Globe, LikeFill } from '../vectors';
import { roboto } from '@/lib/fonts';

interface Props {
  item: Item;
}

export default function LinkRow({ item }: Props) {
  const {
    thumbnail,
    title,
    body,
    author,
    createdAt,
    publisher,
    user,
    itemStats: { likes, commentsCount },
  } = item;
  const dateDistance = useDateDistance(createdAt);
  const searchParams = useSearchParams();
  const { mode } = useTheme();

  const link = `/items/${item.id}?mode=${
    searchParams.get('mode') ?? 'trending'
  }`;
  return (
    <div className={cn(styles.block, mode === 'dark' && styles.dark)}>
      <Link href={link} className={styles.styled_link} tabIndex={-1}>
        <div className={styles.main}>
          <h3 className={styles.title}>{item.title}</h3>
          <div className={styles.publisher}>
            {publisher.favicon ? (
              <figure className={styles.favicon}>
                <Image
                  src={publisher.favicon}
                  alt={`${publisher.name} 로고 이미지`}
                  title={publisher.name}
                  width={16}
                  height={16}
                />
              </figure>
            ) : (
              <Globe />
            )}
            {author ? `${author} · ` : ''}
            {publisher.name}
          </div>
          <p className={cn(styles.body, roboto.className)}>{body}</p>
        </div>
        <div className={styles.thumbnail_wrapper}>
          <Image
            src={
              thumbnail?.url ?? 'https://img.mztrees.com/not-fount-image.svg'
            }
            alt={`${title} 썸네일 이미지`}
            title={title}
            placeholder='blur'
            blurDataURL={blurDataUrl}
            width={160}
            height={160}
            priority
            className={styles.thumbnail}
          />
        </div>
      </Link>
      <div className={styles.spacer} />
      <div className={styles.footer}>
        <div className={styles.count_shower}>
          {likes === 0 ? null : (
            <div className={styles.likes_count}>
              <LikeFill />
              {likes.toLocaleString()}
            </div>
          )}
          {commentsCount === 0 ? null : (
            <div className={styles.comments_count}>
              <Chat />
              {commentsCount.toLocaleString()}
            </div>
          )}
        </div>
        <p className={styles.user_info}>
          by <b>{user.username}</b> · {dateDistance}
        </p>
      </div>
    </div>
  );
}
