import { useEffect } from 'react';
import { create } from 'zustand';

/**
 * use: home.tsx / linkcard.tsx
 * home에서의 window size가 768 이상이면 모든 linkcard에 isMultiColumn = true
 * 테블릿 크기 기준으로 유저의 linkcard 크기에 특정 작업을 걸기 위함
 */

interface MultiColumnStore {
  isMultiColumn: boolean;
  set: (isMultiColumn: boolean) => void;
}

export const useMultiColumnStore = create<MultiColumnStore>((set) => ({
  isMultiColumn: false,
  set: (isMultiColumn: boolean) => set((state) => ({ ...state, isMultiColumn })),
}));

export const useIsMultiColumn = () => useMultiColumnStore((state) => state.isMultiColumn);
export const useIsMultiColumnCheck = () => {
  const set = useMultiColumnStore((state) => state.set);
  const isMultiColumn = useIsMultiColumn();

  useEffect(() => {
    if (window.innerWidth > 768) {
      set(true);
    } else {
      set(false);
    }
    // console.log('hi', isMultiColumn);

    const onResize = () => {
      const nextValue = window.innerWidth > 768;
      if (nextValue !== isMultiColumn) {
        set(nextValue);
      }
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [set, isMultiColumn]);
};
