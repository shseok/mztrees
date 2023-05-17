import { useParams } from 'react-router-dom';

/**
 * Returns ItemId URL parameter in items page
 */
export function useItemId() {
  const { itemId } = useParams<{ itemId: string }>();
  const parsed = itemId ? parseInt(itemId) : null;
  if (parsed && isNaN(parsed)) return null;
  return parsed;
}
