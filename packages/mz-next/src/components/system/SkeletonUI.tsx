import styles from "@/styles/loading.module.scss";

export default function SkeletonUI() {
  return (
    <div className={styles.list}>
      {new Array(6).fill("").map((_, i) => (
        <LoadingItem key={i} />
      ))}
    </div>
  );
}

function LoadingItem() {
  return (
    <div className={styles.block}>
      <div className={styles.content}>
        <div className={styles.thumbnail} />
        <div className={styles.publisher}>
          <div className={styles.circle} />
          <div className={styles.text} />
        </div>
        <div className={styles.title} />
        <div className={styles.body} />
      </div>
      <div className={styles.bottom} />
    </div>
  );
}
