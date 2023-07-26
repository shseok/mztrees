import styles from "@/styles/EmptyList.module.scss";

type Props = {
  message?: string;
};

export default function EmptyList({
  message = "리스트가 비어있습니다.",
}: Props) {
  return <div className={styles.block}>{message}</div>;
}
