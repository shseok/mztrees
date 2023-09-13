import React from "react";
import styles from "@/styles/WriteFormTemplate.module.scss";
import Button from "../system/Button";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/common";
import LoadingIndicator from "../system/LoadingIndicator";

interface Props {
  description?: string;
  children: React.ReactNode;
  buttonText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  loadingPercent?: number;
}

const WriteFormTemplate = ({
  description,
  children,
  buttonText,
  onSubmit,
  isLoading,
  loadingPercent,
}: Props) => {
  const { mode } = useTheme();
  return (
    <form
      className={cn(styles.styled_form, mode === "dark" && styles.dark)}
      method="POST"
      onSubmit={onSubmit}
    >
      {description && <h3>{description}</h3>}
      <div className={styles.content}>{children}</div>
      <Button disabled={isLoading}>
        {isLoading ? (
          loadingPercent !== undefined ? (
            `${loadingPercent}%`
          ) : (
            <LoadingIndicator color="white" />
          )
        ) : (
          buttonText
        )}
      </Button>
    </form>
  );
};

export default WriteFormTemplate;
