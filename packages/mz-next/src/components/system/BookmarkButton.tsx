import { Size } from "@/types/db";
import IconToggleButton from "./IconToggleButton";
import { BookmarkOutline, Bookmark } from "@/utils/vectors";
import styles from "@/styles/BookmarkButton.module.scss";

interface Props {
  onClick: () => void;
  isBookmarked: boolean;
  size?: Size;
}

const BookmarkButton = ({ onClick, isBookmarked, size = "medium" }: Props) => {
  return (
    <IconToggleButton
      onClick={onClick}
      isActive={isBookmarked}
      size={size}
      activeIcon={<Bookmark className={styles.styled_like_fill} />}
      inactiveIcon={<BookmarkOutline className={styles.styled_like_outline} />}
    />
  );
};

export default BookmarkButton;
