import styles from "@/styles/LoadingIndicator.module.scss";
import { Spinner } from "@/utils/vectors";

const LoadingIndicator = () => {
  return <Spinner className={styles.styled_spinner} />;
};
export default LoadingIndicator;
