import { useQuery } from '@tanstack/react-query';
import { getComments } from '@/lib/api/items';
import { UseQueryOptionsOf } from '@/lib/type';

// 밖에서 option에 대해 많은 override를 할지 안할지 모르지만 일단 작성
export function useGetCommentsQuery(
  itemId: number,
  options: UseQueryOptionsOf<typeof getComments> = {}
) {
  return useQuery(extractKey(itemId), () => getComments(itemId), options);
}

// 다른 곳에서 불러와서 쓸 때 편하게 하기 위함
const extractKey = (itemId: number) => ['comments', itemId];
useGetCommentsQuery.extractKey = extractKey;
