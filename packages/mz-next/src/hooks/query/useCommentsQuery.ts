import { useQuery, useQueries } from '@tanstack/react-query';
import { getComments, getItem } from '~/lib/api/items';
import { UseQueryOptionsOf } from '~/lib/type';

// 밖에서 option에 대해 많은 override를 할지 안할지 모르지만 일단 작성
export function useCommentsQuery(
  itemId: number,
  options: UseQueryOptionsOf<typeof getComments> = {},
) {
  return useQuery(extractKey(itemId), () => getComments(itemId), options);
}

// 다른 곳에서 불러와서 쓸 때 편하게 하기 위함
const extractKey = (itemId: number) => ['comments', itemId];
useCommentsQuery.extractKey = extractKey;

// for promise.all (item, comment)
export function useItemAndCommentsQuery(itemId: number) {
  return useQueries({
    queries: [
      {
        queryKey: ['item', itemId],
        queryFn: () => getItem(itemId),
      },
      {
        queryKey: ['comments', itemId],
        queryFn: () => getComments(itemId),
      },
    ],
  });
}
