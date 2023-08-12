import { useCallback, useRef } from "react";
import { useItemOverrideSetter } from "./stores/ItemOverrideStore";
import { createBookmark, deleteBookmark } from "@/lib/api/bookmark";
import { useOpenLoginDialog } from "./useOpenLoginDialog";
import { extractNextError } from "@/lib/nextError";
import { refreshToken } from "@/lib/api/auth";
import { setClientCookie } from "@/lib/client";

// TODO: refactor try catch
export const useBookmarkManager = () => {
  const set = useItemOverrideSetter();
  const abortControllers = useRef(new Map<number, AbortController>()).current;
  const openLoginDialog = useOpenLoginDialog();

  const bookmark = useCallback(
    async (itemId: number) => {
      const prevController = abortControllers.get(itemId);
      const controller = new AbortController();
      try {
        prevController?.abort();
        set(itemId, {
          isBookmarked: true,
        });
        abortControllers.set(itemId, controller);
        await createBookmark(itemId, controller);
        abortControllers.delete(itemId);
      } catch (e) {
        const error = extractNextError(e);
        if (error.name === "Unauthorized" && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);

            await createBookmark(itemId, controller);
            abortControllers.delete(itemId);
            // for latest server state update
            set(itemId, {
              isBookmarked: true,
            });
          } catch (innerError) {
            set(itemId, {
              isBookmarked: false,
            });
            openLoginDialog("sessionOut");
          }
        } else {
          set(itemId, {
            isBookmarked: false,
          });
        }
        // TODO: fail api -> handle error (rollback state)
        console.log(extractNextError(e));
      }
    },
    [set, abortControllers, openLoginDialog]
  );

  const unbookmark = useCallback(
    async (itemId: number) => {
      const prevController = abortControllers.get(itemId);
      const controller = new AbortController();
      try {
        prevController?.abort();
        set(itemId, {
          isBookmarked: false,
        });
        abortControllers.set(itemId, controller);
        await deleteBookmark(itemId, controller);
        abortControllers.delete(itemId);
      } catch (e) {
        const error = extractNextError(e);
        if (error.name === "Unauthorized" && error.payload?.isExpiredToken) {
          try {
            const tokens = await refreshToken();
            setClientCookie(`access_token=${tokens.accessToken}`);

            await deleteBookmark(itemId, controller);
            abortControllers.delete(itemId);
            // for latest server state update
            set(itemId, {
              isBookmarked: false,
            });
          } catch (innerError) {
            set(itemId, {
              isBookmarked: true,
            });
            openLoginDialog("sessionOut");
          }
        } else {
          set(itemId, {
            isBookmarked: true,
          });
        }
        // TODO: fail api -> handle error (rollback state)
        console.log(extractNextError(e));
      }
    },
    [set, abortControllers, openLoginDialog]
  );
  return { bookmark, unbookmark };
};
