import { useCallback, useRef } from 'react';
import { useItemOverride } from '~/context/ItemOverrideContext';
import { likeItem, unlikeItem } from '~/lib/api/items';
import { ItemStats } from '~/lib/api/types';

// like와 unlike 로직 내부에서는 state[id].itemStats는 변하지 않는다.
// 결국, 컴포넌트에서 쓰일 때, 변한다.
export const useLikeManager = () => {
  const { state, actions } = useItemOverride();
  const concurrentCounterRef = useRef<Map<number, number>>(new Map());
  const like = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const counters = concurrentCounterRef.current;
      try {
        actions.set(id, {
          itemStats: { ...initialStats, likes: initialStats.likes + 1 },
          isLiked: true,
        });
        const counter = (counters.get(id) ?? 0) + 1;
        counters.set(id, counter);
        const result = await likeItem(id);
        console.log('pending...', counters.get(id), counter);
        if (counters.get(id) !== counter) return;
        // for latest server state update
        actions.set(id, { itemStats: result.itemStats, isLiked: true });
      } catch (e) {
        /** @todo : fail api -> handle error (rollback state) */
        console.error(e);
      }
    },
    [actions],
  );

  const unlike = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const counters = concurrentCounterRef.current;
      try {
        actions.set(id, {
          itemStats: { ...initialStats, likes: initialStats.likes - 1 },
          isLiked: false,
        });
        const counter = (counters.get(id) ?? 0) + 1;
        counters.set(id, counter);
        const result = await unlikeItem(id);
        console.log('pending...', counters.get(id), counter);
        if (counters.get(id) !== counter) return;
        // for latest server state update
        actions.set(id, { itemStats: result.itemStats, isLiked: false });
      } catch (e) {
        /** @todo : fail api -> handle error (rollback state) */
        console.error(e);
      }
    },
    [actions],
  );
  return { like, unlike };
};
