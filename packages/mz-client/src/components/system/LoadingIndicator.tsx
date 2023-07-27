import styles from "@/styles/LoadingIndicator.module.scss";
import { Spinner } from "@/components/vectors";

interface Props {
  color?: string;
}

const LoadingIndicator = ({ color }: Props) => {
  return <Spinner className={styles.styled_spinner} style={{ color: color }} />;
};
export default LoadingIndicator;
