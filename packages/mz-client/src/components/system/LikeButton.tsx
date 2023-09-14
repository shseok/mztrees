import { LikeFill, LikeOutline } from "@/components/vectors";
import styles from "@/styles/LikeButton.module.scss";
import IconToggleButton from "./IconToggleButton";
import { Size } from "@/types/db";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/common";

interface Props {
  onClick: () => void;
  isLiked: boolean;
  size?: Size;
}

const LikeButton = ({ onClick, isLiked, size = "medium" }: Props) => {
  const { mode } = useTheme();
  return (
    <IconToggleButton
      onClick={onClick}
      isActive={isLiked}
      size={size}
      activeIcon={<LikeFill className={styles.styled_like_fill} />}
      inactiveIcon={
        <LikeOutline
          className={cn(
            styles.styled_like_outline,
            mode === "dark" && styles.dark
          )}
        />
      }
      ariaLabel="like"
    />
  );
};

export default LikeButton;
