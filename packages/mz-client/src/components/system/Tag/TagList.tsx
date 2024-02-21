import type { TagList } from '@/types/db';
import styles from '@/styles/TagList.module.scss';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/utils/common';

export default function TagList({ tags }: { tags: string[] }) {
  const { mode } = useTheme();
  return (
    <div>
      {tags.map((tag, index) => (
        <div
          className={cn(styles.tag, mode === 'dark' && styles.dark)}
          key={index}
        >
          # {tag}
        </div>
      ))}
    </div>
  );
}
