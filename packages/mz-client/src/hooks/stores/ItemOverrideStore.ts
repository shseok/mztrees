import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';
import type { ItemStats } from '@/types/db';
import { devtools } from 'zustand/middleware';

interface OverridableItem {
  isLiked?: boolean;
  itemStats?: ItemStats;
  isBookmarked?: boolean;
}

interface ItemOverrideStore {
  overrides: Record<number, OverridableItem | undefined>;
  setOverrides: (itemId: number, overridableItem: OverridableItem) => void;
}

const useItemOverrideStore = create<ItemOverrideStore>()(
  immer(
    devtools((set) => ({
      overrides: {},
      setOverrides: (itemId, overridableItem) => {
        set((store) => {
          store.overrides[itemId] = overridableItem;
        });
      },
    }))
  )
);

export const useItemOverrideById = (itemId: number) => {
  const overrides = useItemOverrideStore((store) => store.overrides);
  return overrides[itemId];
};

export const useItemOverrideSetter = () => {
  return useItemOverrideStore((store) => store.setOverrides);
};
