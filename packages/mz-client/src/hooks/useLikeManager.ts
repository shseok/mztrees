import { useCallback, useRef } from 'react';
import { likeItem, unlikeItem } from '@/lib/api/items';
import type { ItemStats } from '@/types/db';
import { useItemOverrideSetter } from './stores/ItemOverrideStore';
import { extractNextError, translateNextErrorMessage } from '@/lib/nextError';
import { useOpenLoginDialog } from './useOpenLoginDialog';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';
import { toast } from 'sonner';

// like와 unlike 로직 내부에서는 state[id].itemStats는 변하지 않는다.
// 결국, 컴포넌트에서 쓰일 때, 변한다.
export const useLikeManager = () => {
  const set = useItemOverrideSetter();
  const abortControllers = useRef(new Map<number, AbortController>()).current;
  const openLoginDialog = useOpenLoginDialog();

  const like = useCallback(
    async (itemId: number, initialStats: ItemStats) => {
      const prevController = abortControllers.get(itemId);
      const controller = new AbortController();

      try {
        // 만약 이전에 진행중이던 요청이 있다면, 취소
        prevController?.abort();
        set(itemId, {
          itemStats: { ...initialStats, likes: initialStats.likes + 1 },
          isLiked: true,
        });
        abortControllers.set(itemId, controller);
        await likeItem(itemId, controller);
      } catch (e) {
        const error = extractNextError(e);
        const erorrMessage = translateNextErrorMessage(error);
        const errorName = e instanceof Error && e.name;
        if (errorName === 'AbortError') return;
        if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);
            // token이 refresh되었을 때, 해당 item을 제외한 다른 item의 오직 isLike만 풀려버리는 문제가 있다.
            // token이 refresh되었으므로, 다시 시도
            await likeItem(itemId, controller);
            set(itemId, {
              itemStats: { ...initialStats, likes: initialStats.likes + 1 },
              isLiked: true,
            });
            // 성공해도 위에서 이미 set을 해줬으니 필요 x
          } catch (innerError) {
            // refresh token이 만료되었을 때
            set(itemId, {
              itemStats: { ...initialStats, likes: initialStats.likes - 1 },
              isLiked: false,
            });
            openLoginDialog('itemLike');
          }
        } else {
          // 로그인이 안된 상태는 앞단에서 막으므로 다른 에러 상황 고려
          set(itemId, {
            itemStats: { ...initialStats, likes: initialStats.likes - 1 },
            isLiked: false,
          });
          toast.error(`좋아요 실패: ${erorrMessage}`);
        }
      } finally {
        abortControllers.delete(itemId);
      }
    },
    [set, abortControllers, openLoginDialog]
  );

  const unlike = useCallback(
    async (itemId: number, initialStats: ItemStats) => {
      const prevController = abortControllers.get(itemId);
      const controller = new AbortController();

      try {
        prevController?.abort();
        set(itemId, {
          itemStats: { ...initialStats, likes: initialStats.likes - 1 },
          isLiked: false,
        });
        abortControllers.set(itemId, controller);
        await unlikeItem(itemId, controller);
      } catch (e) {
        const error = extractNextError(e);
        const erorrMessage = translateNextErrorMessage(error);
        const errorName = e instanceof Error && e.name;
        if (errorName === 'AbortError') return;
        if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);
            await unlikeItem(itemId, controller);
            // 위에서 이미 set을 해줬으니 필요 x
          } catch (innerError) {
            set(itemId, {
              itemStats: { ...initialStats, likes: initialStats.likes + 1 },
              isLiked: true,
            });
            openLoginDialog('itemLike');
          }
        } else {
          // 로그인이 안된 상태는 앞단에서 막으므로 다른 에러 상황 고려
          set(itemId, {
            itemStats: { ...initialStats, likes: initialStats.likes + 1 },
            isLiked: true,
          });
          toast.error(`좋아요 취소 실패: ${erorrMessage}`);
        }
      } finally {
        abortControllers.delete(itemId);
      }
    },
    [set, abortControllers, openLoginDialog]
  );
  return { like, unlike };
};
