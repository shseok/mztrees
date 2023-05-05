import { createContext, useMemo, useState, useContext } from 'react';
import { ItemStats } from '~/lib/api/types';

interface ItemStatsContextState {
  [key: number]: ItemStats;
}

export interface ItemStatsContextActions {
  set(itemId: number, itemStats: ItemStats): void;
}

interface ItemStatsContextType {
  state: ItemStatsContextState;
  actions: ItemStatsContextActions;
}

interface Props {
  children: React.ReactNode;
}

const ItemStatsContext = createContext<ItemStatsContextType | null>(null);

export const ItemStatsProvider = ({ children }: Props) => {
  const [state, setState] = useState<ItemStatsContextState>({});

  const actions: ItemStatsContextActions = useMemo(
    () => ({
      set(itemId, itemStats) {
        setState((prevState) => ({
          ...prevState,
          [itemId]: itemStats,
        }));
      },
    }),
    [],
  );

  return (
    <ItemStatsContext.Provider value={{ state, actions }}>{children}</ItemStatsContext.Provider>
  );
};

export const useItemStats = () => {
  const context = useContext(ItemStatsContext);
  if (context === null) {
    throw new Error('useItemStats must be used within a ItemStatsProvider');
  }
  return context;
};

export const useItemStatsById = (itemId: number): ItemStats | undefined => {
  const { state } = useItemStats();
  return state[itemId];
};
