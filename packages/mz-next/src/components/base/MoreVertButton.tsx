import styles from "@/styles/MoreVertButton.module.scss";
import { MoreVert } from "@/components/vectors";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/common";
interface Props {
  onClick: () => void;
}

const MoreVertButton = ({ onClick }: Props) => {
  const { mode } = useTheme();
  return (
    <button
      className={cn(styles.styled_button, mode === "dark" && styles.dark)}
      onClick={onClick}
    >
      <MoreVert />
    </button>
  );
};

export default MoreVertButton;
