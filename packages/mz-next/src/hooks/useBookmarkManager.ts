import { useCallback, useRef } from 'react';
import { useItemOverrideSetter } from './stores/ItemOverrideStore';
import { createBookmark, deleteBookmark } from '~/lib/api/bookmark';

export const useBookmarkManager = () => {
  const set = useItemOverrideSetter();
  const abortControllers = useRef(new Map<number, AbortController>()).current;

  const bookmark = useCallback(
    async (itemId: number) => {
      const prevController = abortControllers.get(itemId);
      try {
        prevController?.abort();
        set(itemId, {
          isBookmarked: true,
        });
        const controller = new AbortController();
        abortControllers.set(itemId, controller);
        await createBookmark(itemId, controller);
        abortControllers.delete(itemId);
      } catch (e) {
        /** @todo : fail api -> handle error (rollback state) */
        console.error(e);
      }
    },
    [set, abortControllers],
  );

  const unbookmark = useCallback(
    async (itemId: number) => {
      const prevController = abortControllers.get(itemId);
      try {
        prevController?.abort();
        set(itemId, {
          isBookmarked: false,
        });
        const controller = new AbortController();
        abortControllers.set(itemId, controller);
        await deleteBookmark(itemId, controller);
        abortControllers.delete(itemId);
      } catch (e) {
        /** @todo : fail api -> handle error (rollback state) */
        console.error(e);
      }
    },
    [set, abortControllers],
  );
  return { bookmark, unbookmark };
};
