import axios from 'axios';
import { SearchItemsResult } from './types';

export async function searchItems({ q, offset }: { q: string; offset?: number }) {
  const response = await axios.get<SearchItemsResult>('/base/api/search', {
    params: {
      q,
      offset,
    },
  });

  return response.data;
}
