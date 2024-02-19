import styles from '@/styles/Selectors.module.scss';
import ViewSelector from './ViewSelector';
import SortModeSelector from './SortModeSelector';
import WeekSelector from './WeekSelector';
import type { SortMode } from '@/types/db';

interface Props {
  mode: SortMode;
}

export default function Selectors({ mode }: Props) {
  return (
    <>
      <div className={styles.row}>
        <SortModeSelector />
        <ViewSelector />
      </div>
      {mode === 'past' && <WeekSelector />}
    </>
  );
}
