import React from "react";
import styles from "@/styles/Input.module.scss";

export interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ errorMessage, ...rest }: Props, ref) => {
    return (
      <>
        <input className={styles.input} ref={ref} {...rest} />
        {errorMessage ? (
          <div className={styles.message}>{errorMessage}</div>
        ) : null}
      </>
    );
  }
);

Input.displayName = "Input";

export default Input;
