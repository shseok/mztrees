'use client'; // Error components must be Client Components
import styles from '@/styles/Error.module.scss';
import Button from '@/components/system/Button';

export default function ErrorShower({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error(error);
  // }, [error]);

  return (
    <main className={styles.body}>
      <div className={styles.container}>
        <p className={styles.title}>해당 작업에 문제가 있습니다.</p>
        <h1 className={styles.message}>
          {error.message || '알 수 없는 문제가 발생했습니다.'}
        </h1>
        <p className={styles.notification}>
          이후에 다시 시도해주세요. 만약, 문제가 지속된다면 해당 이슈에 대해
          연락을 주세요.
        </p>
        <div className={styles.button_container}>
          <Button
            onClick={
              // Attempt to recover by trying to re-render the segment
              () => reset()
            }
            aria-label='다시 시도'
          >
            다시 시도
          </Button>
          <Button variant='tertiary' to='/' aria-label='홈으로 이동'>
            홈으로
          </Button>
        </div>
      </div>
    </main>
  );
}
