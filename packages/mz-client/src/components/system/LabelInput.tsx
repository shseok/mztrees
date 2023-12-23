'use client';

import React, { forwardRef, useState } from 'react';
import Input, { type Props as InputProps } from '@/components/system/Input';
import styles from '@/styles/LabelInput.module.scss';
import { cn } from '@/utils/common';
import { useTheme } from '@/context/ThemeContext';
interface Props extends InputProps {
  label: string;
}

const LabelInput = forwardRef<HTMLInputElement, Props>(
  ({ label, ...rest }: Props, ref) => {
    const [focused, setFocused] = useState(false);
    const { mode } = useTheme();
    const onFocus = () => {
      setFocused(true);
    };

    const onBlur = () => {
      setFocused(false);
    };

    return (
      <div className={styles.block}>
        <label
          className={cn(
            styles.label,
            focused && styles.focused,
            mode === 'dark' && styles.dark
          )}
        >
          {label}
        </label>
        <Input onFocus={onFocus} onBlur={onBlur} {...rest} ref={ref} />
      </div>
    );
  }
);

LabelInput.displayName = 'LabelInput';

export default LabelInput;
