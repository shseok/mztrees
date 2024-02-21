import React, { useEffect, useRef, useState } from 'react';
import styles from '@/styles/SearchModal.module.scss';
import { useRouter } from 'next/navigation';
import { cn } from '@/utils/common';
import SearchHistory from './SearchHistory';
import SearchHeader from './SearchHeader';
import RecommendTagSelection from './RecommendTagSelection';
import { tagList } from '@/lib/const';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  close: () => void;
}

const SearchModal = ({ isOpen, setIsOpen, close }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
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

  const deleteHistoryKeyword = (value: string) => {
    const filteredSearches = recentSearches.filter(
      (eachVal) => eachVal !== value
    );
    localStorage.setItem('recentSearches', JSON.stringify(filteredSearches));
    setRecentSearches(filteredSearches);
  };

  const deleteHistoryKeywords = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const keyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const hasTag = inputVal.startsWith('#');
    const q = hasTag ? inputVal.slice(1) : inputVal;
    if (e.key === 'Enter') {
      if (q === '' || q.trim() === '') return;
      // store searched word in localstorage
      // maximum 6 words
      const newSearches = [q, ...recentSearches.slice(0, 5)];
      setRecentSearches(newSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      setIsOpen(false);
      setInputVal('');
      if (hasTag) {
        viewNavigate(`/search?q=${q}&type=tag`);
        return;
      }
      viewNavigate(`/search?q=${q}`);
    }
  };

  const isTag = inputVal.at(0) === '#';
  const tagInput = inputVal.slice(1);
  const tags = tagList.filter((tag) => tag.includes(tagInput));

  return (
    // <Overlay visible={visible} />
    <div
      className={
        isOpen ? cn(styles.search_modal, styles.active) : styles.search_modal
      }
      role='dialog'
      aria-label='검색 모달 영역'
    >
      <SearchHeader
        onChange={changeInput}
        onKeyDown={keyDownInput}
        inputRef={inputRef}
        modalClose={close}
      />
      {isTag ? (
        <RecommendTagSelection
          tagList={[...tags]}
          modalClose={close}
          input={inputVal}
        />
      ) : (
        <SearchHistory
          recentSearches={recentSearches}
          deleteHistory={deleteHistoryKeyword}
          deleteAllHistory={deleteHistoryKeywords}
          modalClose={close}
        />
      )}
      <div className={styles.background_overlay} />
    </div>
  );
};

export default SearchModal;
