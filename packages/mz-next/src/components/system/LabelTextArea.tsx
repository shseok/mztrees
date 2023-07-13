import { forwardRef, useState } from "react";
import { cn } from "@/utils/common";
import styles from "@/styles/LabelTextArea.module.scss";

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
      <div className={cn(styles.block, className && styles[className])}>
        <label className={cn(styles.label, focused && styles.focused)}>
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
