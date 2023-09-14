import { Size } from "@/types/db";
import IconToggleButton from "./IconToggleButton";
import { BookmarkOutline, Bookmark } from "@/components/vectors";
import styles from "@/styles/BookmarkButton.module.scss";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/common";

interface Props {
  onClick: () => void;
  isBookmarked: boolean;
  size?: Size;
}

const BookmarkButton = ({ onClick, isBookmarked, size = "medium" }: Props) => {
  const { mode } = useTheme();
  return (
    <IconToggleButton
      onClick={onClick}
      isActive={isBookmarked}
      size={size}
      activeIcon={<Bookmark className={styles.styled_like_fill} />}
      inactiveIcon={
        <BookmarkOutline
          className={cn(
            styles.styled_like_outline,
            mode === "dark" && styles.dark
          )}
        />
      }
      ariaLabel="bookmark"
    />
  );
};

export default BookmarkButton;
