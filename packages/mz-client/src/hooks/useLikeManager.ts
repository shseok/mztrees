import { useCallback, useRef } from 'react';
import { likeItem, unlikeItem } from '@/lib/api/items';
import type { ItemStats } from '@/types/db';
import { useItemOverrideSetter } from './stores/ItemOverrideStore';
import { extractNextError } from '@/lib/nextError';
import { useOpenLoginDialog } from './useOpenLoginDialog';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';

// like와 unlike 로직 내부에서는 state[id].itemStats는 변하지 않는다.
// 결국, 컴포넌트에서 쓰일 때, 변한다.
// refactor: try catch
export const useLikeManager = () => {
  const set = useItemOverrideSetter();
  const abortControllers = useRef(new Map<number, AbortController>()).current;
  const openLoginDialog = useOpenLoginDialog();

  const like = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const prevController = abortControllers.get(id);
      const controller = new AbortController();

      try {
        prevController?.abort();
        set(id, {
          itemStats: { ...initialStats, likes: initialStats.likes + 1 },
          isLiked: true,
        });
        abortControllers.set(id, controller);
        const result = await likeItem(id, controller);
        // for latest server state update
        set(id, { itemStats: result.itemStats, isLiked: true });
      } catch (e) {
        const error = extractNextError(e);
        const errorName = e instanceof Error && e.name;
        if (errorName === 'AbortError') return;
        if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);
            // token이 refresh되었으므로, 다시 시도
            const result = await likeItem(id, controller);
            // for latest server state update
            set(id, { itemStats: result.itemStats, isLiked: true });
          } catch (innerError) {
            // refresh token이 만료되었을 때
            set(id, {
              itemStats: { ...initialStats, likes: initialStats.likes - 1 },
              isLiked: false,
            });
            openLoginDialog('itemLike');
          }
        } else {
          // 아예 로그인 안된 상황
          set(id, {
            itemStats: { ...initialStats, likes: initialStats.likes - 1 },
            isLiked: false,
          });
          openLoginDialog('itemLike');
        }
        // 상황: 로그인은 되어있는데, 좋아요 실패
        console.error('like error', extractNextError(e));
      } finally {
        console.log('finally like');
        abortControllers.delete(id);
      }
    },
    [set, abortControllers]
  );

  const unlike = useCallback(
    async (id: number, initialStats: ItemStats) => {
      const prevController = abortControllers.get(id);
      const controller = new AbortController();

      try {
        prevController?.abort();
        set(id, {
          itemStats: { ...initialStats, likes: initialStats.likes - 1 },
          isLiked: false,
        });
        abortControllers.set(id, controller);
        const result = await unlikeItem(id, controller);
        // for latest server state update
        set(id, { itemStats: result.itemStats, isLiked: false });
      } catch (e) {
        const error = extractNextError(e);
        const errorName = e instanceof Error && e.name;
        if (errorName === 'AbortError') return;
        if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);
            const result = await unlikeItem(id, controller);
            // for latest server state update
            set(id, { itemStats: result.itemStats, isLiked: false });
          } catch (innerError) {
            set(id, {
              itemStats: { ...initialStats, likes: initialStats.likes + 1 },
              isLiked: true,
            });
            // TODO: 좋아요 취소시 재로그인 문구 다시 만들기
            openLoginDialog('itemLike');
          }
        } else {
          // 아예 로그인 안된 상황
          set(id, {
            itemStats: { ...initialStats, likes: initialStats.likes + 1 },
            isLiked: true,
          });
          openLoginDialog('itemLike');
        }
        // TODO: fail api -> handle error (rollback state)
        console.error('unlike error', extractNextError(e));
      } finally {
        console.log('finally unlike');
        abortControllers.delete(id);
      }
    },
    [set, abortControllers]
  );
  return { like, unlike };
};
