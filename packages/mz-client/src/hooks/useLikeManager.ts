import { useCallback } from 'react';
import { useItemOverride } from '~/context/ItemStatsContext';
import { likeItem } from '~/lib/api/items';
import { ItemStats } from '~/lib/api/types';

export const useLikeManager = () => {
  const { actions } = useItemOverride();
  const like = useCallback(
    async (id: number, initialStats: ItemStats) => {
      try {
        actions.set(id, {
          itemStats: { ...initialStats, likes: initialStats.likes + 1 },
          isLiked: true,
        });
        const result = await likeItem(id);
        console.log(result.id);
        actions.set(id, { itemStats: result.itemStats, isLiked: true }); // 한번더??
      } catch (e) {
        console.error(e);
      }
    },
    [actions],
  );

  const unlike = useCallback(
    async (id: number, initialStats: ItemStats) => {
      try {
        actions.set(id, {
          itemStats: { ...initialStats, likes: initialStats.likes - 1 },
          isLiked: false,
        });
        const result = await likeItem(id);
        console.log(result.id);
        actions.set(id, { itemStats: result.itemStats, isLiked: false }); // 한번더??
      } catch (e) {
        console.error(e);
      }
    },
    [actions],
  );
  return { like, unlike };
};
