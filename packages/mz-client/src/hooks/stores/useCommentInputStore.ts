import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CommentInputStore {
  visible: boolean;
  parentCommentId: number | null;
  commentId: number | null;
  defaultText: string;
  write: (parentCommentId?: number | null) => void;
  edit: (commentId: number, defaultText: string) => void;
  close: () => void;
  // toggle(): void;
}

export const useCommentInputStore = create<
  CommentInputStore,
  [['zustand/devtools', CommentInputStore]]
>(
  devtools((set) => ({
    visible: false,
    parentCommentId: null,
    commentId: null,
    defaultText: '',
    write: (parentCommentId: number | null = null) =>
      set((state) => ({ ...state, parentCommentId, visible: true })),
    edit: (commentId: number, defaultText: string) =>
      set((store) => ({ ...store, commentId, defaultText, visible: true })),
    close: () => set((store) => ({ ...store, commentId: null, defaultText: '', visible: false })),
  })),
);
