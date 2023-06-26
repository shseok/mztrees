import { Item } from "@/lib/api/types";
import Image from "next/image";
import globe from "../../../public/assets/globe.svg";
import { useDateDistance } from "@/hooks/useDateDistance";
import { useLikeManager } from "@/hooks/useLikeManager";
import LikeButton from "../system/LikeButton";
import { useItemOverrideById } from "@/hooks/stores/ItemOverrideStore";
import { motion, AnimatePresence } from "framer-motion";
import { getMyAccount } from "@/lib/api/me";
import { useOpenLoginDialog } from "@/hooks/useOpenLoginDialog";
import BookmarkButton from "../system/BookmarkButton";
import { useBookmarkManager } from "@/hooks/useBookmarkManager";
import { useSetUser, useUser } from "@/hooks/stores/userStore";
import styles from "@/styles/LinkCard.module.scss";
import Link from "next/link";

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

  // const isMultiColumn = useIsMultiColumn();
  // console.log(isMultiColumn);

  const isLiked = itemOverride?.isLiked ?? item.isLiked;
  const likes = itemOverride?.itemStats?.likes ?? itemStats.likes;
  const isBookmarked = itemOverride?.isBookmarked ?? item.isBookmarked;
  /**TODO: 연타로 누르면 기존의 것이 잘 취소되어야함 */
  const openLoginDialog = useOpenLoginDialog();
  // const set = setUser();
  // const currentUser = useUser();
  /**TODO: move to hooks */
  const toggleLike = async () => {
    const currentUser = await getMyAccount();
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
    const currentUser = await getMyAccount();
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

  const link = `/items/${item.id}`;

  return (
    <div className={styles.block}>
      <Link href={link} className={styles.styled_link}>
        {thumbnail ? <Image src={thumbnail} alt={title} /> : null}
        <div className={styles.publisher}>
          {favicon ? (
            <Image src={favicon} alt="favicon" />
          ) : (
            <Image src={globe} alt="globe" />
          )}
          {author ? `${author} · ` : ""}
          {name}
        </div>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.body}>{body}</p>
      </Link>
      <div className={styles.likecount_wrapper}>
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
      </div>
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
  );
};

export default LinkCard;
