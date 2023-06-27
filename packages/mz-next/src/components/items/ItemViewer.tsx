import React from "react";
import { Item } from "@/lib/api/types";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import LikeButton from "../system/LikeButton";
import { useLikeManager } from "@/hooks/useLikeManager";
import { useOpenLoginDialog } from "@/hooks/useOpenLoginDialog";
import { getMyAccount } from "@/lib/api/me";
import { useItemOverrideById } from "@/hooks/stores/ItemOverrideStore";
import { useDateDistance } from "@/hooks/useDateDistance";
import BookmarkButton from "../system/BookmarkButton";
import { useBookmarkManager } from "@/hooks/useBookmarkManager";
import { useSetUser, useUser } from "@/hooks/stores/userStore";
import Link from "next/link";
import styles from "@/styles/ItemViewer.module.scss";
import { Globe } from "@/utils/vectors";

interface Props {
  item: Item;
}

const ItemViewer = ({ item }: Props) => {
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

  const isLiked = itemOverride?.isLiked ?? item.isLiked;
  const likes = itemOverride?.itemStats?.likes ?? itemStats.likes;
  const isBookmarked = itemOverride?.isBookmarked ?? item.isBookmarked;
  /**TODO: 연타로 누르면 기존의 것이 잘 취소되어야함 */
  const openLoginDialog = useOpenLoginDialog();
  // const set = setUser();
  const currentUser = useUser();
  /**TODO: move to hooks */
  const toggleLike = async () => {
    // const currentUser = await getMyAccount();
    // set(currentUser);
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
    // const currentUser = await getMyAccount();
    // set(currentUser);
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
  return (
    <div className={styles.block}>
      {thumbnail ? (
        <Link href={item.link}>
          <div className={styles.thumbnail}>
            <Image src={thumbnail} fill alt="thumbnail" />
          </div>
        </Link>
      ) : null}
      <div className={styles.content}>
        <Link href={item.link}>
          <div className={styles.publisher}>
            {favicon ? (
              <Image src={favicon} alt="favicon" width={16} height={16} />
            ) : (
              <Globe />
            )}
            {author ? `${author} · ` : ""}
            {name}
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.body}>{body}</p>
        </Link>
        <AnimatePresence initial={false}>
          {likes === 0 ? null : (
            <motion.div
              className={styles.likescount}
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
          </div>
          <p className={styles.user_info}>
            by <b>{username}</b> · {dateDistance}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemViewer;
