import { useTheme } from '@/context/ThemeContext';
import styles from '@/styles/RecommendTagSelection.module.scss';
import { cn } from '@/utils/common';
import { useRouter } from 'next/navigation';

interface Props {
  input: string;
  tagList: string[];
  modalClose: () => void;
}

export default function RecommendTagSelection({
  input,
  tagList,
  modalClose,
}: Props) {
  const router = useRouter();
  const { mode } = useTheme();

  return (
    <div
      className={cn(styles.container_wrapper, mode === 'dark' && styles.dark)}
    >
      <div className={styles.container}>
        <p className={styles.title}>추천 태그</p>
        <div className={styles.listContainer}>
          {tagList.map((item, index) => (
            <button
              type='button'
              aria-label='옵션 선택'
              className={styles.item}
              key={index}
              onClick={(e) => {
                e.preventDefault();
                modalClose();
                const hasTag = input.startsWith('#');
                if (hasTag) {
                  router.push(`/search?q=${item}&type=tag`);
                  return;
                }
                router.push(`/search?q=${item}`);
              }}
              tabIndex={0}
            >
              # {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
