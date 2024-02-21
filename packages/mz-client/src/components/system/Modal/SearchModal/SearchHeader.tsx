import styles from '@/styles/SearchHeader.module.scss';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import { Close, Search } from '../../../vectors';

interface Props {
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  modalClose: () => void;
}

export default function SearchHeader({
  inputRef,
  onChange,
  onKeyDown,
  modalClose,
}: Props) {
  const { mode } = useTheme();
  return (
    <div
      className={cn(styles.container_wrapper, mode === 'dark' && styles.dark)}
    >
      <div className={styles.container}>
        <Search className={styles.search_icon} />
        <input
          type='text'
          id='searchInput'
          ref={inputRef}
          placeholder='어떤 콘텐츠가 궁금하신가요?'
          className={styles.news_search_input}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <Close onClick={modalClose} className={styles.close_icon} />
      </div>
    </div>
  );
}
