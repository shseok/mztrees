import { useCallback, useRef } from 'react';
import { likeItem, unlikeItem } from '~/lib/api/items';
import { ItemStats } from '~/lib/api/types';
import { useItemOverrideSetter } from './stores/ItemOverrideStore';

// like와 unlike 로직 내부에서는 state[id].itemStats는 변하지 않는다.
// 결국, 컴포넌트에서 쓰일 때, 변한다.
export const useLikeManager = () => {
  const set = useItemOverrideSetter();
  const abortControllers = useRef(new Map<number, AbortController>()).current;

  const like = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const prevController = abortControllers.get(id);
      try {
        prevController?.abort();
        set(id, {
          itemStats: { ...initialStats, likes: initialStats.likes + 1 },
          isLiked: true,
        });
        const controller = new AbortController();
        abortControllers.set(id, controller);
        const result = await likeItem(id, controller);
        abortControllers.delete(id);
        // for latest server state update
        set(id, { itemStats: result.itemStats, isLiked: true });
      } catch (e) {
        /** @todo : fail api -> handle error (rollback state) */
        console.error(e);
      }
    },
    [set, abortControllers],
  );

  const unlike = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const prevController = abortControllers.get(id);
      try {
        prevController?.abort();
        set(id, {
          itemStats: { ...initialStats, likes: initialStats.likes - 1 },
          isLiked: false,
        });
        const controller = new AbortController();
        abortControllers.set(id, controller);
        const result = await unlikeItem(id, controller);
        abortControllers.delete(id);
        // for latest server state update
        set(id, { itemStats: result.itemStats, isLiked: false });
      } catch (e) {
        /** @todo : fail api -> handle error (rollback state) */
        console.error(e);
      }
    },
    [set, abortControllers],
  );
  return { like, unlike };
};
