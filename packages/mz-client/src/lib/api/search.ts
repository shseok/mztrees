import { stringify } from 'qs';
import { fetchClient } from '../client';
import { SearchItemsResult } from '@/types/db';

export async function searchItems({
  q,
  offset,
}: {
  q: string;
  offset?: number;
}) {
  const query = stringify({ q, offset }, { addQueryPrefix: true });
  const response = await fetchClient.get<SearchItemsResult>(
    '/api/search'.concat(query)
  );

  return response;
}
