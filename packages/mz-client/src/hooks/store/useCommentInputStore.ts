import { create } from 'zustand';

interface CommentInputStore {
  visible: boolean;
  // open: () => void;
  // close: () => void;
  toggle: () => void;
}

export const useCommentInputStore = create<CommentInputStore>((set) => ({
  visible: false,
  toggle: () => set((state) => ({ visible: !state.visible })),
}));
