import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CommentInputStore {
  visible: boolean;
  parentCommentId: number | null;
  open: () => void;
  // close: () => void;
  // toggle: () => void;
}

export const useCommentInputStore = create<
  CommentInputStore,
  [['zustand/devtools', CommentInputStore]]
>(
  devtools((set) => ({
    visible: false,
    parentCommentId: null,
    // toggle: (parentCommentId: number | null = null) =>
    //   set((state) => ({ parentCommentId, visible: !state.visible })),
    open: (parentCommentId: number | null = null) =>
      set((state) => ({ ...state, parentCommentId, visible: true })),
    // close: () => set(() => ({ visible: false })),
  })),
);
