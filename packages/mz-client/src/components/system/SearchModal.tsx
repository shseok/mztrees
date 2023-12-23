import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/SearchModal.module.scss';
import { Close, Search, TrashCan } from '../vectors';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/common';
import { useTheme } from '@/context/ThemeContext';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  close: () => void;
}

const SearchModal = ({ isOpen, setIsOpen, close }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { mode } = useTheme();
  const router = useRouter();
  useEffect(() => {
    const searches = localStorage.getItem('recentSearches');
    if (searches) {
      setRecentSearches(JSON.parse(searches));
    }
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleKeywordDelete = (value: string) => {
    const filteredSearches = recentSearches.filter(
      (eachVal) => eachVal !== value
    );
    localStorage.setItem('recentSearches', JSON.stringify(filteredSearches));
    setRecentSearches(filteredSearches);
  };

  const handleAllDelete = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    // console.log(inputVal);
  };

  const viewNavigate = (newRoute: string) => {
    if (!document.startViewTransition) {
      return router.push(newRoute);
    } else {
      return document.startViewTransition(() => {
        router.push(newRoute);
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const q = inputVal;
    if (e.key === 'Enter') {
      if (q === '' || q.trim() === '') return;
      // store searched word in localstorage
      // maximum 6 words
      const newSearches = [q, ...recentSearches.slice(0, 5)];
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      setIsOpen(false);
      setInputVal('');
      viewNavigate(`/search?q=${q}`);
    }
  };

  return (
    // <Overlay visible={visible} />
    <div
      className={
        isOpen
          ? cn(
              styles.search_modal,
              styles.active,
              mode === 'dark' && styles.dark
            )
          : styles.search_modal
      }
    >
      <div className={styles.search_part}>
        <div className={styles.container}>
          <Search className={styles.search_icon} />
          <input
            ref={inputRef}
            className={styles.news_search_input}
            id='searchInput'
            placeholder='어떤 콘텐츠가 궁금하신가요?'
            type='text'
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />
          <Close onClick={close} className={styles.close_icon} />
        </div>
      </div>
      <div className={styles.search_sub_part}>
        <div className={styles.container}>
          <div className={styles.recent_keyword_part}>
            <div className={styles.title}>
              최근검색어
              <button
                className={
                  recentSearches.length
                    ? cn(styles.sub_action, styles.active)
                    : styles.sub_action
                }
                onClick={handleAllDelete}
              >
                전체 삭제
              </button>
            </div>
            <div
              className={cn(styles.recent_keyword_part_wrapper, styles.empty)}
            >
              <div
                className={
                  recentSearches.length
                    ? styles.empty_recent_keyword
                    : cn(styles.empty_recent_keyword, styles.empty)
                }
              >
                최근 검색어가 없습니다.
              </div>
              <div
                className={styles.recent_keyword_list}
                id='recentKeywordList'
              >
                {recentSearches.map((recentKeywords, idx) => (
                  <div
                    className={styles.recent_keyword}
                    key={idx}
                    onClick={() => {
                      router.push(`/search?q=${recentKeywords}`);
                      close();
                    }}
                  >
                    <span className={styles.keyword_title}>
                      {recentKeywords}
                    </span>
                    <button
                      className={styles.icon_delete_wrapper}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleKeywordDelete(recentKeywords);
                      }}
                    >
                      <TrashCan className={styles.icon_delete} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.background_overlay} />
    </div>
  );
};

export default SearchModal;
