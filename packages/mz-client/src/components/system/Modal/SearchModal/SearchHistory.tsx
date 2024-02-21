import { TrashCan } from '../../../vectors';
import styles from '@/styles/SearchHistory.module.scss';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';
import { useRouter } from 'next/navigation';

interface Props {
  recentSearches: string[];
  modalClose: () => void;
  deleteHistory: (value: string) => void;
  deleteAllHistory: () => void;
}

export default function SearchHistory({
  recentSearches,
  modalClose,
  deleteHistory,
  deleteAllHistory,
}: Props) {
  const { mode } = useTheme();
  const router = useRouter();

  return (
    <div
      className={cn(styles.container_wrapper, mode === 'dark' && styles.dark)}
    >
      <div className={styles.container}>
        <div className={styles.recent_keyword_part}>
          <div className={styles.title}>
            최근검색어
            <button
              type='button'
              aria-label='최근 검색 결과 전체 삭제'
              className={
                recentSearches.length
                  ? cn(styles.sub_action, styles.active)
                  : styles.sub_action
              }
              onClick={deleteAllHistory}
            >
              전체 삭제
            </button>
          </div>
          <div className={cn(styles.recent_keyword_part_wrapper, styles.empty)}>
            <div
              className={
                recentSearches.length
                  ? styles.empty_recent_keyword
                  : cn(styles.empty_recent_keyword, styles.empty)
              }
            >
              최근 검색어가 없습니다.
            </div>
            <div className={styles.recent_keyword_list} id='recentKeywordList'>
              {recentSearches.map((recentKeywords, idx) => (
                <div
                  className={cn(
                    styles.recent_keyword,
                    mode === 'dark' && styles.dark
                  )}
                  key={idx}
                  onClick={() => {
                    router.push(`/search?q=${recentKeywords}`);
                    modalClose();
                  }}
                >
                  <span className={styles.keyword_title}>{recentKeywords}</span>
                  <button
                    type='button'
                    aria-label='해당 검색어 삭제'
                    className={styles.icon_delete_wrapper}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHistory(recentKeywords);
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
  );
}
