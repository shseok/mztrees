import type { Item } from '@/types/db';
import Image from 'next/image';
import { Chat, Globe, LikeFill } from '@/components/vectors';
import { useDateDistance } from '@/hooks/useDateDistance';
import styles from '@/styles/LinkCard.module.scss';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import { roboto } from '@/lib/fonts';
import { blurDataUrl } from '@/lib/const';
import type { OutputData } from '@editorjs/editorjs';
import DOMPurify from 'dompurify';

interface Props {
  item: Item;
}

const LinkCard = ({ item }: Props) => {
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

  const sanitizedHTML = (html: string) => {
    const config = { USE_PROFILES: { html: true } };
    return DOMPurify.sanitize(html, config);
  };

  const bodyObj = JSON.parse(body) as OutputData;
  const bodyText =
    bodyObj.blocks
      ?.filter((block) => block.type === 'paragraph')
      ?.map((block) => sanitizedHTML(block.data.text))
      .join('') ?? '';

  return (
    <div className={cn(styles.block, mode === 'dark' && styles.dark)}>
      <Link href={link} className={styles.styled_link} tabIndex={-1}>
        <div className={styles.thumbnail_wrapper}>
          <Image
            src={
              thumbnail?.url ?? 'https://img.mztrees.com/not-fount-image.svg'
            }
            alt={`${title} 썸네일 이미지`}
            title={title}
            placeholder='blur'
            blurDataURL={blurDataUrl}
            fill
            sizes='(max-width: 767px) 94vw, (max-width: 1199px) 46vw, 346px' // sizes="346"을 하면 정작 모바일 화면에서 645px 너비를 가져야하는 이미지가 깨짐 > 346으로 크기를 확대했기 때문. 따라서 이처럼 변경
            priority
            className={styles.thumbnail}
          />
        </div>
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
        <h3 className={styles.title}>{item.title}</h3>
        <p
          className={cn(styles.body, roboto.className)}
          dangerouslySetInnerHTML={{ __html: bodyText }}
        ></p>
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
};

export default LinkCard;
