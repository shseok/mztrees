import { getWeekRangeFromDate } from '@/lib/week';
import type { SortMode, Tag, View } from '@/types/db';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface HomeParameterStore {
  mode: SortMode;
  tag: Tag | null;
  view: View;
  dateRange: string[];
  setMode: (mode: SortMode) => void;
  setTag: (tag: Tag | null) => void;
  setView: (view: View) => void;
  setDateRange: (dateRange: string[]) => void;
}

export const homeParameterStore = create<HomeParameterStore>()(
  devtools((set) => ({
    mode: 'trending',
    tag: null,
    view: 'card',
    dateRange: getWeekRangeFromDate(new Date()),
    setMode: (mode) => set((store) => ({ ...store, mode })),
    setTag: (tag) => set((store) => ({ ...store, tag })),
    setView: (view) => set((store) => ({ ...store, view })),
    setDateRange: (dateRange) => set((store) => ({ ...store, dateRange })),
  }))
);
