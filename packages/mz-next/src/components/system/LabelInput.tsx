"use client";

import React, { forwardRef, useState } from "react";
import Input, { type Props as InputProps } from "@/components/system/Input";
import styles from "@/styles/LabelInput.module.scss";
import { cn } from "@/utils/common";
interface Props extends InputProps {
  label: string;
}

const LabelInput = forwardRef<HTMLInputElement, Props>(
  ({ label, ...rest }: Props, ref) => {
    const [focused, setFocused] = useState(false);

    const onFocus = () => {
      setFocused(true);
    };

    const onBlur = () => {
      setFocused(false);
    };

    return (
      <div className={styles.block}>
        <label className={cn(styles.label, focused && styles.focused)}>
          {label}
        </label>
        <Input onFocus={onFocus} onBlur={onBlur} {...rest} ref={ref} />
      </div>
    );
  }
);

LabelInput.displayName = "LabelInput";

export default LabelInput;
