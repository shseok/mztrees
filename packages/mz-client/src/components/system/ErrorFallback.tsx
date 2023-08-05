import { refreshToken } from "@/lib/api/auth";
import { extractNextError } from "@/lib/nextError";
import { usePathname, useRouter } from "next/navigation";
import Button from "./Button";
import styles from "@/styles/ErrorFallback.module.scss";

type FallbackProps = {
  error: any;
  resetErrorBoundary: (...args: any[]) => void;
};

const getErrorMessage = () => {
  const title = "서비스에 접속할 수 없습니다.";
  const content = "새로고침을 하거나 잠시 후 다시 접속해 주시기 바랍니다.";
  return { title, content };
};

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const { name, payload } = extractNextError(error);
  const { title, content } = getErrorMessage();
  const router = useRouter();
  const pathname = usePathname();

  const onClickHandler = async () => {
    if (name === "Unauthorized" && payload?.isExpiredToken) {
      try {
        await refreshToken();
      } catch (e) {
        // TODO: toast alaram > "refresh token is expired || rotation error"
        // but, not work..
        router.push(`/login?next=${pathname}`);
      }
      resetErrorBoundary();
      return;
    }
    router.push(`/login?next=${pathname}`);
  };

  return (
    <div className={styles.error_fallback_wrapper}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.content}>{content}</p>
        <Button onClick={onClickHandler}>새로고침</Button>
      </div>
    </div>
  );
}

export default ErrorFallback;
