import { useCallback } from 'react';
import { useItemStats } from '~/context/ItemStatsContext';
import { likeItem } from '~/lib/api/items';
import { ItemStats } from '~/lib/api/types';

export const useLikeManager = () => {
  const { actions } = useItemStats();
  const like = useCallback(
    async (id: number, initialStats: ItemStats) => {
      try {
        actions.set(id, { ...initialStats, likes: initialStats.likes + 1 });
        const result = await likeItem(id);
        console.log(result.id);
        actions.set(id, result.itemStats); // 한번더??
      } catch (e) {
        console.error(e);
      }
    },
    [actions],
  );

  const unlike = useCallback(
    async (id: number, initialStats: ItemStats) => {
      try {
        actions.set(id, { ...initialStats, likes: initialStats.likes - 1 });
        const result = await likeItem(id);
        console.log(result.id);
        actions.set(id, result.itemStats); // 한번더??
      } catch (e) {
        console.error(e);
      }
    },
    [actions],
  );
  return { like, unlike };
};
