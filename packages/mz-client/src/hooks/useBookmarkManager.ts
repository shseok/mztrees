import { useCallback, useRef } from 'react';
import { useItemOverrideSetter } from './stores/ItemOverrideStore';
import { createBookmark, deleteBookmark } from '@/lib/api/bookmark';
import { useOpenLoginDialog } from './useOpenLoginDialog';
import { extractNextError, translateNextErrorMessage } from '@/lib/nextError';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';
import { toast } from 'sonner';

export const useBookmarkManager = () => {
  const set = useItemOverrideSetter();
  const abortControllers = useRef(new Map<number, AbortController>()).current;
  const openLoginDialog = useOpenLoginDialog();

  const bookmark = useCallback(
    async (itemId: number) => {
      const prevController = abortControllers.get(itemId);
      const controller = new AbortController();
      try {
        // 만약 이전에 진행중이던 요청이 있다면, 취소
        prevController?.abort();
        set(itemId, {
          isBookmarked: true,
        });
        abortControllers.set(itemId, controller);
        await createBookmark(itemId, controller);
      } catch (e) {
        const error = extractNextError(e);
        const erorrMessage = translateNextErrorMessage(error);
        const errorName = e instanceof Error && e.name;
        if (errorName === 'AbortError') return;
        if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);
            await createBookmark(itemId, controller);
            // for latest server state update
            set(itemId, {
              isBookmarked: true,
            });
          } catch (innerError) {
            set(itemId, {
              isBookmarked: false,
            });
            openLoginDialog('sessionOut');
          }
        } else {
          set(itemId, {
            isBookmarked: false,
          });
          toast.error(`북마크 추가 실패: ${erorrMessage}`);
        }
      } finally {
        abortControllers.delete(itemId);
      }
    },
    [set, abortControllers, openLoginDialog]
  );

  const unbookmark = useCallback(
    async (itemId: number) => {
      const prevController = abortControllers.get(itemId);
      const controller = new AbortController();
      try {
        // 만약 이전에 진행중이던 요청이 있다면, 취소
        prevController?.abort();
        set(itemId, {
          isBookmarked: false,
        });
        abortControllers.set(itemId, controller);
        await deleteBookmark(itemId, controller);
      } catch (e) {
        const error = extractNextError(e);
        const erorrMessage = translateNextErrorMessage(error);
        const errorName = e instanceof Error && e.name;
        if (errorName === 'AbortError') return;
        if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);

            await deleteBookmark(itemId, controller);
            // for latest server state update
            set(itemId, {
              isBookmarked: false,
            });
          } catch (innerError) {
            set(itemId, {
              isBookmarked: true,
            });
            openLoginDialog('sessionOut');
          }
        } else {
          set(itemId, {
            isBookmarked: true,
          });
          toast.error(`북마크 삭제 실패: ${erorrMessage}`);
        }
      } finally {
        abortControllers.delete(itemId);
      }
    },
    [set, abortControllers, openLoginDialog]
  );
  return { bookmark, unbookmark };
};
