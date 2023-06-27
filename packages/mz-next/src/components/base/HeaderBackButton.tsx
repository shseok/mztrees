import styles from "@/styles/HeaderBackButton.module.scss";
import { ArrowLeft } from "@/utils/vectors";

interface Props {
  onClick: () => void;
}

const HeaderBackButton = ({ onClick }: Props) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <ArrowLeft />
    </button>
  );
};
export default HeaderBackButton;
