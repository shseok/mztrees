import React from "react";
import styles from "@/styles/WriteFormTemplate.module.scss";
import Button from "../system/Button";

interface Props {
  description?: string;
  children: React.ReactNode;
  buttonText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const WriteFormTemplate = ({
  description,
  children,
  buttonText,
  onSubmit,
}: Props) => {
  return (
    <form className={styles.styled_form} method="POST" onSubmit={onSubmit}>
      {description && <h3>{description}</h3>}
      <div className={styles.content}>{children}</div>
      <Button>{buttonText}</Button>
    </form>
  );
};

export default WriteFormTemplate;
