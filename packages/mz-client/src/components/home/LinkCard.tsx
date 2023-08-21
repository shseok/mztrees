import { Item } from "@/types/db";
import Image from "next/image";
import { Globe } from "@/components/vectors";
import { useDateDistance } from "@/hooks/useDateDistance";
import { useLikeManager } from "@/hooks/useLikeManager";
import LikeButton from "../system/LikeButton";
import { useItemOverrideById } from "@/hooks/stores/ItemOverrideStore";
import { motion, AnimatePresence } from "framer-motion";
import { useOpenLoginDialog } from "@/hooks/useOpenLoginDialog";
import BookmarkButton from "../system/BookmarkButton";
import { useBookmarkManager } from "@/hooks/useBookmarkManager";
import styles from "@/styles/LinkCard.module.scss";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useSearchParams } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/common";

interface Props {
  item: Item;
}

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

  const link = `/items/${item.id}?mode=${
    searchParams.get("mode") ?? "trending"
  }`;

  return (
    <div className={styles.block}>
      <Link href={link} className={styles.styled_link}>
        <div className={styles.thumbnail}>
          <Image
            src={
              thumbnail?.url ?? "https://img.mztrees.com/not-fount-image.svg"
            }
            alt={title}
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className={cn(styles.publisher, mode === "dark" && styles.dark)}>
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
        <h3 className={cn(styles.title, mode === "dark" && styles.dark)}>
          {item.title}
        </h3>
        <p className={cn(styles.body, mode === "dark" && styles.dark)}>
          {body}
        </p>
      </Link>
      <div className={styles.spacer} />
      <div className={styles.count_wrapper}>
        <AnimatePresence initial={false}>
          {likes === 0 ? null : (
            <motion.div
              className={cn(styles.likescount, mode === "dark" && styles.dark)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              좋아요 {likes.toLocaleString()}개
            </motion.div>
          )}
        </AnimatePresence>
        {commentsCount === 0 ? null : (
          <div
            className={cn(styles.commentscount, mode === "dark" && styles.dark)}
          >
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
        <p className={cn(styles.user_info, mode === "dark" && styles.dark)}>
          by <b>{username}</b> · {dateDistance}
        </p>
      </div>
    </div>
  );
};

export default LinkCard;
