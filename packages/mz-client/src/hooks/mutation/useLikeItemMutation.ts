import { useMutation, useQueryClient } from '@tanstack/react-query';
import { likeItem, unlikeItem } from '@/lib/api/items';
import { useGetItemQuery } from '../query/useGetItemQuery';
import type { Item } from '@/types/db';
import { extractNextError } from '@/lib/nextError';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';
import { toast } from 'sonner';
import { useOpenLoginDialog } from '../useOpenLoginDialog';

export function useLikeItemMutation() {
  const queryClient = useQueryClient();
  const openLoginDialog = useOpenLoginDialog();

  const { mutate: like } = useMutation({
    mutationFn: likeItem,
    onMutate: async (variables) => {
      const queryKey = useGetItemQuery.extractKey(variables);
      // 이전에 진행중이던 요청이 있다면, 취소
      await queryClient.cancelQueries(queryKey);
      // 이전 쿼리 값의 스냅샷
      const previousItem = queryClient.getQueryData<Item>(queryKey);
      // 새로운 데이터 업데이트 (낙관적 업데이트)
      queryClient.setQueryData<Item>(queryKey, (oldItem: Item | undefined) => {
        if (!oldItem) return;
        return {
          ...oldItem,
          isLiked: true,
          itemStats: {
            ...oldItem.itemStats,
            likes: oldItem.itemStats.likes + 1,
          },
        };
      });
      // 이전 쿼리 값의 스냅샷을 반환
      return { previousItem };
    },
    onError: async (err, varialbes, context) => {
      const error = extractNextError(err);
      const queryKey = useGetItemQuery.extractKey(varialbes);
      if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
        try {
          // token refresh
          const tokens = await refreshToken();
          setClientCookie(`access_token=${tokens.accessToken}`);
        } catch (innerError) {
          // refresh token이 만료되었을 때
          // 실패 시, 이전 값으로 롤백
          queryClient.setQueryData(queryKey, context?.previousItem);
          openLoginDialog('itemLike');
        }
      } else {
        // 실패 시, 이전 값으로 롤백
        queryClient.setQueryData(queryKey, context?.previousItem);
        // 로그인이 안된 상태는 앞단에서 막으므로 다른 에러 상황 고려
        toast.error(`좋아요를 누르는데 실패했습니다: ${error.message}`);
      }
    },
    onSettled: (data, error, variables) => {
      // 성공, 실패 여부와 상관없이, 쿼리를 다시 fetch
      queryClient.invalidateQueries(useGetItemQuery.extractKey(variables));
    },
  });

  const { mutate: unlike } = useMutation({
    mutationFn: unlikeItem,
    onMutate: async (variables) => {
      const queryKey = useGetItemQuery.extractKey(variables);
      // 이전에 진행중이던 요청이 있다면, 취소
      await queryClient.cancelQueries(queryKey);
      // 이전 쿼리 값의 스냅샷
      const previousItem = queryClient.getQueryData<Item>(queryKey);
      // 새로운 데이터 업데이트 (낙관적 업데이트)
      queryClient.setQueryData<Item>(queryKey, (oldItem: Item | undefined) => {
        if (!oldItem) return;
        return {
          ...oldItem,
          isLiked: false,
          itemStats: {
            ...oldItem.itemStats,
            likes: oldItem.itemStats.likes - 1,
          },
        };
      });
      // 이전 쿼리 값의 스냅샷을 반환
      return { previousItem };
    },
    onError: async (err, varialbes, context) => {
      const error = extractNextError(err);
      const queryKey = useGetItemQuery.extractKey(varialbes);
      if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
        try {
          // token refresh
          const tokens = await refreshToken();
          setClientCookie(`access_token=${tokens.accessToken}`);
        } catch (innerError) {
          // refresh token이 만료되었을 때
          // 실패 시, 이전 값으로 롤백
          queryClient.setQueryData(queryKey, context?.previousItem);
          openLoginDialog('itemLike');
        }
      } else {
        // 실패 시, 이전 값으로 롤백
        queryClient.setQueryData(queryKey, context?.previousItem);
        // 로그인이 안된 상태는 앞단에서 막으므로 다른 에러 상황 고려
        toast.error(`좋아요를 누르는데 실패했습니다: ${error.message}`);
      }
    },
    onSettled: (data, error, variables) => {
      // 성공, 실패 여부와 상관없이, 쿼리를 다시 fetch
      queryClient.invalidateQueries(useGetItemQuery.extractKey(variables));
    },
  });

  return { like, unlike };
}
