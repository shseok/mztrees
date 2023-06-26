import { forwardRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "@/styles/LabelTextArea.module.scss";

const cx = classNames.bind(styles);

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

const LabelTextArea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, onBlur, onFocus, className, ...rest }: Props, ref) => {
    const [focused, setFocused] = useState(false);
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      onFocus?.(e);
      setFocused(true);
    };
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      onBlur?.(e);
      setFocused(false);
    };

    return (
      <div className={cx(className, "block")}>
        <label className={cx("label", focused && styles.focused)}>
          {label}
        </label>
        <textarea
          className={styles.styled_text_area}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
          ref={ref}
        />
      </div>
    );
  }
);

LabelTextArea.displayName = "LabelTextArea";

export default LabelTextArea;
