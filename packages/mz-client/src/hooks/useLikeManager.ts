import { useCallback } from 'react';
import { useItemOverride } from '~/context/ItemOverrideContext';
import { likeItem, unlikeItem } from '~/lib/api/items';
import { ItemStats } from '~/lib/api/types';

// like와 unlike 로직 내부에서는 state[id].itemStats는 변하지 않는다. 결국, 컴포넌트에서 쓰일 때, 변한다.
export const useLikeManager = () => {
  const { state, actions } = useItemOverride();
  const like = useCallback(
    async (id: number, initialStats: ItemStats) => {
      try {
        // console.log(state[id].itemStats);
        actions.set(id, {
          itemStats: { ...initialStats, likes: initialStats.likes + 1 },
          isLiked: true,
        });
        const result = await likeItem(id);
        actions.set(id, { itemStats: result.itemStats, isLiked: true });
        // console.log(state[id].itemStats, result.itemStats);
      } catch (e) {
        /** @todo : fail api -> handle error (rollback state) */
        console.error(e);
      }
    },
    [actions],
  );

  const unlike = useCallback(
    async (id: number, initialStats: ItemStats) => {
      try {
        // console.log(state[id].itemStats);
        actions.set(id, {
          itemStats: { ...initialStats, likes: initialStats.likes - 1 },
          isLiked: false,
        });
        const result = await unlikeItem(id);
        actions.set(id, { itemStats: result.itemStats, isLiked: false });
        // console.log(state[id].itemStats, result.itemStats);
      } catch (e) {
        /** @todo : fail api -> handle error (rollback state) */
        console.error(e);
      }
    },
    [actions],
  );
  return { like, unlike };
};
