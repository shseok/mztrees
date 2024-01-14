import type { Item } from '@/types/db';
import Image from 'next/image';
import { Globe } from '@/components/vectors';
import { useDateDistance } from '@/hooks/useDateDistance';
import { useLikeManager } from '@/hooks/useLikeManager';
import LikeButton from '../system/LikeButton';
import { useItemOverrideById } from '@/hooks/stores/ItemOverrideStore';
import { useOpenLoginDialog } from '@/hooks/useOpenLoginDialog';
import BookmarkButton from '../system/BookmarkButton';
import { useBookmarkManager } from '@/hooks/useBookmarkManager';
import styles from '@/styles/LinkCard.module.scss';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import { roboto } from '@/lib/fonts';
import { blurDataUrl } from '@/lib/const';
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from '@/utils/dynamic';

interface Props {
  item: Item;
}

const stagger = 0.15;

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const LinkCard = ({ item }: Props) => {
  const {
    id,
    thumbnail,
    title,
    body,
    author,
    createdAt,
    user: { username },
    publisher: { favicon, name },
  } = item;
  const itemOverride = useItemOverrideById(id);
  const itemStats = itemOverride?.itemStats ?? item.itemStats;
  const dateDistance = useDateDistance(createdAt);
  const { like, unlike } = useLikeManager();
  const { bookmark, unbookmark } = useBookmarkManager();
  const searchParams = useSearchParams();

  const isLiked = itemOverride?.isLiked ?? item.isLiked;
  const likes = itemOverride?.itemStats?.likes ?? itemStats.likes;
  const commentsCount =
    itemOverride?.itemStats?.commentsCount ?? itemStats.commentsCount;
  const isBookmarked = itemOverride?.isBookmarked ?? item.isBookmarked;
  const openLoginDialog = useOpenLoginDialog();
  const { currentUser } = useUser();
  const { mode } = useTheme();
  /**TODO: move to hooks */
  const toggleLike = () => {
    if (!currentUser) {
      openLoginDialog('itemLike');
      return;
    }
    if (isLiked) {
      unlike(id, itemStats);
    } else {
      like(id, itemStats);
    }
  };

  const toggleBookmark = () => {
    if (!currentUser) {
      openLoginDialog('itemBookmark');
      return;
    }
    if (isBookmarked) {
      unbookmark(id);
    } else {
      bookmark(id);
    }
  };

  const link = `/items/${item.id}?mode=${
    searchParams.get('mode') ?? 'trending'
  }`;

  return (
    <AnimatePresence mode='sync'>
      <LazyMotion features={loadFeature}>
        <MotionDiv
          key={item.id}
          variants={variants}
          initial='hidden'
          animate='visible'
          transition={{
            delay: stagger,
            ease: 'easeInOut',
            duration: 0.35,
          }}
          viewport={{ amount: 0 }}
          className={cn(styles.block, mode === 'dark' && styles.dark)}
        >
          {/* TODO: prefetch={false} > detailed item 클릭시 느리지만 비용 절약(초기 렌더링x) > 나중에 부담되면 적용 */}
          <Link href={link} className={styles.styled_link} tabIndex={-1}>
            <div className={styles.thumbnail_wrapper}>
              <Image
                src={
                  thumbnail?.url ??
                  'https://img.mztrees.com/not-fount-image.svg'
                }
                alt={`${name} 썸네일 이미지`}
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
              {favicon ? (
                <figure className={styles.favicon}>
                  <Image
                    src={favicon}
                    alt={`${name} 로고 이미지`}
                    title={name}
                    width={16}
                    height={16}
                  />
                </figure>
              ) : (
                <Globe />
              )}
              {author ? `${author} · ` : ''}
              {name}
            </div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={cn(styles.body, roboto.className)}>{body}</p>
          </Link>
          <div className={styles.spacer} />
          <div className={styles.count_wrapper}>
            <AnimatePresence initial={false}>
              {likes === 0 ? null : (
                <LazyMotion features={loadFeature}>
                  <MotionDiv
                    className={styles.likescount}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role='status'
                  >
                    좋아요 {likes.toLocaleString()}개
                  </MotionDiv>
                </LazyMotion>
              )}
            </AnimatePresence>
            {commentsCount === 0 ? null : (
              <div className={styles.commentscount} role='status'>
                댓글 {commentsCount.toLocaleString()}개
              </div>
            )}
          </div>
          <div className={styles.footer}>
            <div className={styles.icon_buttons}>
              <LikeButton onClick={toggleLike} isLiked={isLiked} />
              <BookmarkButton
                onClick={toggleBookmark}
                isBookmarked={isBookmarked}
              />
            </div>
            <p className={styles.user_info}>
              by <b>{username}</b> · {dateDistance}
            </p>
          </div>
        </MotionDiv>
      </LazyMotion>
    </AnimatePresence>
  );
};

export default LinkCard;
