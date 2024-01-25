import styles from '@/styles/ViewSelector.module.scss';
import { CardView, ListView } from '../vectors';
import { homeParameterStore } from '@/hooks/stores/HomeParameterStore';
import { shallow } from 'zustand/shallow';
import { View } from '@/types/db';
import { cn } from '@/utils/common';
import useSetSearchParams from '@/hooks/useSetSearchParams';

export default function ViewSelector() {
  const { view, mode, tag, setView } = homeParameterStore(
    (state) => ({
      view: state.view,
      mode: state.mode,
      tag: state.tag,
      setView: state.setView,
    }),
    shallow
  );
  const setSearchParams = useSetSearchParams();
  const handleClick = (type: View) => {
    setView(type);
    setSearchParams({ mode, tag, view: type });
  };

  return (
    <ul role='menu' className={styles.menu}>
      <li>
        <button
          role='menuitem'
          className={cn(styles.menu_item, view === 'card' && styles.active)}
          onClick={() => handleClick('card')}
        >
          <CardView />
        </button>
      </li>
      <li>
        <button
          role='menuitem'
          className={cn(styles.menu_item, view === 'list' && styles.active)}
          onClick={() => handleClick('list')}
        >
          <ListView />
        </button>
      </li>
    </ul>
  );
}
