import React, { useState } from 'react';
import type { Item } from '@/types/db';
import Image from 'next/image';
import LikeButton from '../system/LikeButton';
import { useLikeManager } from '@/hooks/useLikeManager';
import { useOpenLoginDialog } from '@/hooks/useOpenLoginDialog';
import { useItemOverrideById } from '@/hooks/stores/ItemOverrideStore';
import { useDateDistance } from '@/hooks/useDateDistance';
import BookmarkButton from '../system/BookmarkButton';
import { useBookmarkManager } from '@/hooks/useBookmarkManager';
import Link from 'next/link';
import styles from '@/styles/ItemViewer.module.scss';
import { Globe } from '@/components/vectors';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import { roboto } from '@/lib/fonts';
import { blurDataUrl } from '@/lib/const';
import MoreVertButton from '../base/MoreVertButton';
import PopperMenu, { PopperMenuItem } from '../system/PopperMenu';
import Button from '../system/Button';
import {
  AnimatePresence,
  MotionDiv,
  LazyMotion,
  loadFeature,
} from '@/utils/dynamic';
interface Props {
  item: Item;
  items: PopperMenuItem[];
  isMyItem: boolean;
}

const ItemViewer = ({ item, isMyItem, items }: Props) => {
  const { id, thumbnail, title, body, author, createdAt, user, publisher } =
    item;
  const itemOverride = useItemOverrideById(id);
  const dateDistance = useDateDistance(createdAt);
  const openLoginDialog = useOpenLoginDialog();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const itemStats = itemOverride?.itemStats ?? item.itemStats;
  const likes = itemOverride?.itemStats?.likes ?? itemStats.likes;
  const isLiked = itemOverride?.isLiked ?? item.isLiked;
  const isBookmarked = itemOverride?.isBookmarked ?? item.isBookmarked;

  const { like, unlike } = useLikeManager();
  const { bookmark, unbookmark } = useBookmarkManager();
  const { currentUser } = useUser();
  const { mode } = useTheme();

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

  const onClickMore = () => {
    setIsMenuVisible(true);
  };

  const onCloseMenu = () => {
    setIsMenuVisible(false);
  };

  return (
    <div className={styles.block}>
      <Link
        href={item.link}
        className={styles.thumbnail_wrapper}
        target='_blank'
      >
        <Image
          src={thumbnail?.url ?? 'https://img.mztrees.com/not-fount-image.svg'}
          alt={`세부 페이지에서 ${title} 썸네일 이미지`}
          title={`${title}-클릭시 원본 이미지 링크로 방문`}
          placeholder='blur'
          blurDataURL={blurDataUrl}
          fill
          sizes='(max-width: 767px) 100vw, 736px'
          priority
          className={styles.thumbnail}
        />
      </Link>
      <div className={cn(styles.content, mode === 'dark' && styles.dark_mode)}>
        <div className={styles.item_head}>
          <div className={styles.item_info}>
            <figure className={styles.publisher}>
              {publisher.favicon ? (
                <Image
                  src={publisher.favicon}
                  alt={`세부 페이지에서 ${publisher.name} 로고 이미지`}
                  title={`세부 페이지에서 ${publisher.name}`}
                  width={16}
                  height={16}
                />
              ) : (
                <Globe />
              )}
              {author ? `${author} · ` : ''}
              {publisher.name}
            </figure>
            <h2 className={cn(styles.title)}>
              <Link href={item.link} target='_blank'>
                {title}
              </Link>
            </h2>
          </div>
          <Button
            type='button'
            aria-label='방문하기'
            to={item.link}
            variant='visit'
            isBlank
          >
            방문
          </Button>
        </div>
        <p className={cn(styles.body, roboto.className)}>{body}</p>
        <div className={styles.tag_container}>
          <h4 className={styles.tag_title}>태그</h4>
          <div>
            {item.tags.map((tag, index) => (
              <div className={styles.tag} key={index}>
                # {tag}
              </div>
            ))}
          </div>
        </div>
        <AnimatePresence initial={false}>
          {likes === 0 ? null : (
            <LazyMotion features={loadFeature}>
              <MotionDiv
                className={cn(styles.likescount)}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 26, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                role='status'
              >
                좋아요 {likes.toLocaleString()}개
              </MotionDiv>
            </LazyMotion>
          )}
        </AnimatePresence>
        <div className={styles.footer}>
          <div className={styles.icon_container}>
            <LikeButton onClick={toggleLike} isLiked={isLiked} />
            <BookmarkButton
              onClick={toggleBookmark}
              isBookmarked={isBookmarked}
            />
            {isMyItem && (
              <div className={styles.morevert_container}>
                {/* TODO: work on for desktop */}
                <MoreVertButton
                  onClickMore={onClickMore}
                  style={{ padding: 0 }}
                />
                <PopperMenu
                  items={items}
                  visible={isMenuVisible}
                  mode='item'
                  location='right'
                  onClose={onCloseMenu}
                />
              </div>
            )}
          </div>
          <p className={cn(styles.user_info)}>
            by <b>{user.username}</b> · {dateDistance}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemViewer;
