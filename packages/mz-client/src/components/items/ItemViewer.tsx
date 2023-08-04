import React, { useState } from "react";
import { Item } from "@/types/db";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import LikeButton from "../system/LikeButton";
import { useLikeManager } from "@/hooks/useLikeManager";
import { useOpenLoginDialog } from "@/hooks/useOpenLoginDialog";
import { useItemOverrideById } from "@/hooks/stores/ItemOverrideStore";
import { useDateDistance } from "@/hooks/useDateDistance";
import BookmarkButton from "../system/BookmarkButton";
import { useBookmarkManager } from "@/hooks/useBookmarkManager";
import Link from "next/link";
import styles from "@/styles/ItemViewer.module.scss";
import { Globe } from "@/components/vectors";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/common";
import MoreVertButton from "../base/MoreVertButton";
import PopperMenu, { PopperMenuItem } from "../system/PopperMenu";
import Button from "../system/Button";

interface Props {
  item: Item;
  items: PopperMenuItem[];
  isMyItem: boolean;
}

const ItemViewer = ({ item, isMyItem, items }: Props) => {
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
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const itemOverride = useItemOverrideById(id);
  const itemStats = itemOverride?.itemStats ?? item.itemStats;
  const dateDistance = useDateDistance(createdAt);
  const { like, unlike } = useLikeManager();
  const { bookmark, unbookmark } = useBookmarkManager();

  const isLiked = itemOverride?.isLiked ?? item.isLiked;
  const likes = itemOverride?.itemStats?.likes ?? itemStats.likes;
  const isBookmarked = itemOverride?.isBookmarked ?? item.isBookmarked;
  /**TODO: 연타로 누르면 기존의 것이 잘 취소되어야함 */
  const openLoginDialog = useOpenLoginDialog();
  const { currentUser } = useUser();
  const { mode } = useTheme();
  /**TODO: move to hooks */
  const toggleLike = async () => {
    if (!currentUser) {
      openLoginDialog("itemLike");
      return;
    }
    if (isLiked) {
      unlike(id, itemStats);
    } else {
      like(id, itemStats);
    }
  };

  const toggleBookmark = async () => {
    if (!currentUser) {
      openLoginDialog("itemBookmark");
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
      {thumbnail ? (
        <Link href={item.link} className={styles.thumbnail}>
          <Image src={thumbnail} alt={title} fill priority sizes="100vw" />
        </Link>
      ) : null}
      <div className={styles.content}>
        <div className={styles.item_head}>
          <div className={styles.item_info}>
            <div
              className={cn(styles.publisher, mode === "dark" && styles.dark)}
            >
              {favicon ? (
                <Image src={favicon} alt="favicon" width={16} height={16} />
              ) : (
                <Globe />
              )}
              {author ? `${author} · ` : ""}
              {name}
            </div>
            <h2 className={cn(styles.title, mode === "dark" && styles.dark)}>
              <Link href={item.link}>{title}</Link>
            </h2>
          </div>
          <Button to={item.link} variant="visit">
            방문
          </Button>
        </div>
        <p className={cn(styles.body, mode === "dark" && styles.dark)}>
          {body}
        </p>
        <AnimatePresence initial={false}>
          {likes === 0 ? null : (
            <motion.div
              className={cn(styles.likescount, mode === "dark" && styles.dark)}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 26, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              좋아요 {likes.toLocaleString()}개
            </motion.div>
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
                  mode="item"
                  location="right"
                  onClose={onCloseMenu}
                />
              </div>
            )}
          </div>
          <p className={cn(styles.user_info, mode === "dark" && styles.dark)}>
            by <b>{username}</b> · {dateDistance}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemViewer;
