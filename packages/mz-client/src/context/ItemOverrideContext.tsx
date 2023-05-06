import { createContext, useMemo, useState, useContext } from 'react';
import { ItemStats } from '~/lib/api/types';

interface OverridableItem {
  isLiked: boolean;
  itemStats: ItemStats;
}

interface ItemOverrideContextState {
  [key: number]: OverridableItem;
}

export interface ItemOverrideContextActions {
  set(itemId: number, overridableItem: OverridableItem): void;
}

interface ItemOverrideContextType {
  state: ItemOverrideContextState;
  actions: ItemOverrideContextActions;
}

interface Props {
  children: React.ReactNode;
}

const ItemOverrideContext = createContext<ItemOverrideContextType | null>(null);

export const ItemOverrideProvider = ({ children }: Props) => {
  const [state, setState] = useState<ItemOverrideContextState>({});

  const actions: ItemOverrideContextActions = useMemo(
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
    <ItemOverrideContext.Provider value={{ state, actions }}>
      {children}
    </ItemOverrideContext.Provider>
  );
};

export const useItemOverride = () => {
  const context = useContext(ItemOverrideContext);
  if (context === null) {
    throw new Error('useItemOverride must be used within a ItemStatsProvider');
  }
  return context;
};

export const useItemOverrideById = (itemId: number): OverridableItem | undefined => {
  const { state } = useItemOverride();
  return state[itemId];
};
