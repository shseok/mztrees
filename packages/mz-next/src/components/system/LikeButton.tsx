import { LikeFill, LikeOutline } from "@/utils/vectors";
import styles from "@/styles/LikeButton.module.scss";
import IconToggleButton from "./IconToggleButton";
import { Size } from "@/types/db";

interface Props {
  onClick: () => void;
  isLiked: boolean;
  size?: Size;
}

const LikeButton = ({ onClick, isLiked, size = "medium" }: Props) => {
  return (
    <IconToggleButton
      onClick={onClick}
      isActive={isLiked}
      size={size}
      activeIcon={<LikeFill className={styles.styled_like_fill} />}
      inactiveIcon={<LikeOutline className={styles.styled_like_outline} />}
    />
  );
};

export default LikeButton;
