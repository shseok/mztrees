import React, { forwardRef, useState } from "react";
import Input, { type Props as InputProps } from "@/components/system/Input";
import styles from "@/styles/LabelInput.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
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
        <label className={cx("label", focused && "focused")}>{label}</label>
        <Input onFocus={onFocus} onBlur={onBlur} {...rest} ref={ref} />
      </div>
    );
  }
);

LabelInput.displayName = "LabelInput";

export default LabelInput;
