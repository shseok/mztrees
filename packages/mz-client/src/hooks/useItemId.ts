"use client";

import { useParams } from "next/navigation";

/**
 * Returns ItemId URL parameter in items page
 */
export function useItemId() {
  const { id } = useParams();
  const parsed = id ? parseInt(id) : null;
  if (parsed && isNaN(parsed)) return null;
  return parsed;
}
