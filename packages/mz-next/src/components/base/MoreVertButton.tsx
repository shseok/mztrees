import styles from "@/styles/MoreVertButton.module.scss";
import { MoreVert } from "@/components/vectors";
interface Props {
  onClick: () => void;
}

const MoreVertButton = ({ onClick }: Props) => {
  return (
    <button className={styles.styled_button} onClick={onClick}>
      <MoreVert />
    </button>
  );
};

export default MoreVertButton;
