import { getItem } from '@/lib/api/items';
import { useQuery } from '@tanstack/react-query';

export function useGetItemQuery(itemId: number) {
  return useQuery(extractKey(itemId), () => getItem(itemId));
}

const extractKey = (itemId: number) => ['item', itemId];
useGetItemQuery.extractKey = extractKey;
