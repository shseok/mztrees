import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface DeskTopCommentInputStore {
  visible: boolean;
  parentCommentId: number | null;
  commentId: number | null;
  defaultText: string;
  write: (parentCommentId?: number | null) => void;
  edit: (defaultText: string) => void;
  close: () => void;
  // toggle(): void;
}

export const useDeskTopCommentInputStore = create<
  DeskTopCommentInputStore,
  [["zustand/devtools", DeskTopCommentInputStore]]
>(
  devtools((set) => ({
    visible: false,
    parentCommentId: null,
    commentId: null,
    defaultText: "",
    write: (parentCommentId: number | null = null) =>
      set((state) => ({ ...state, parentCommentId, visible: true })),
    edit: (defaultText: string) =>
      set((store) => ({ ...store, defaultText, visible: true })),
    close: () =>
      set((store) => ({
        ...store,
        commentId: null,
        defaultText: "",
        visible: false,
      })),
  }))
);
