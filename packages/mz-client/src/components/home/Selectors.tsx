import styles from '@/styles/Selectors.module.scss';
import ViewSelector from './ViewSelector';
import SortModeSelector from './SortModeSelector';
import WeekSelector from './WeekSelector';
import TagSelector from './TagSelector';
import type { SortMode } from '@/types/db';

interface Props {
  mode: SortMode;
}

export default function Selectors({ mode }: Props) {
  return (
    <>
      <SortModeSelector />
      <div className={styles.tag_view_row}>
        <TagSelector />
        <ViewSelector />
      </div>
      {mode === 'past' && <WeekSelector />}
    </>
  );
}
