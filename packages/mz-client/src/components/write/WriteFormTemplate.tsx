import React from 'react';
import styles from '@/styles/WriteFormTemplate.module.scss';
import Button from '../system/Button';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import LoadingIndicator from '../system/LoadingIndicator';
import GifSelectButton from './GifButton';

interface Props {
  description?: string;
  children: React.ReactNode;
  buttonText: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading?: boolean;
  loadingPercent?: number;
  hasGifButton?: boolean;
}

const WriteFormTemplate = ({
  description,
  children,
  buttonText,
  onSubmit,
  isLoading,
  loadingPercent,
  hasGifButton = false,
}: Props) => {
  const { mode } = useTheme();
  return (
    <form
      className={cn(styles.styled_form, mode === 'dark' && styles.dark)}
      method='POST'
      onSubmit={onSubmit}
    >
      <div className={styles.title}>
        {description && <h3>{description}</h3>}
      </div>
      <div className={styles.content}>{children}</div>
      <div className={styles.button_wrapper}>
        {hasGifButton && <GifSelectButton />}
        <Button
          disabled={isLoading}
          layoutmode='fullWidth'
          aria-label='작성 폼 전송'
        >
          {isLoading ? (
            loadingPercent !== undefined ? (
              `${loadingPercent}%`
            ) : (
              <LoadingIndicator color='white' />
            )
          ) : (
            buttonText
          )}
        </Button>
      </div>
    </form>
  );
};

export default WriteFormTemplate;
