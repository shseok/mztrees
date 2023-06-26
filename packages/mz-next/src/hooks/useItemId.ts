"use client";

import { useParams } from "next/navigation";

/**
 * Returns ItemId URL parameter in items page
 */
export function useItemId() {
  const { itemId } = useParams();
  const parsed = itemId ? parseInt(itemId) : null;
  if (parsed && isNaN(parsed)) return null;
  return parsed;
}
