import { produce } from 'immer';
import { create } from 'zustand';

interface CommentLike {
  likes: number;
  isLiked: boolean;
}

interface CommentLikesStore {
  commentLikesMap: Record<number, CommentLike>;
  set: (commentId: number, commentLike: CommentLike) => void;
}

export const useCommentLikesStore = create<CommentLikesStore>((set) => ({
  commentLikesMap: {},
  set: (commentId, commentLike) =>
    set((store) =>
      produce(store, (draft) => {
        draft.commentLikesMap[commentId] = commentLike;
      }),
    ),
}));

export const useCommentLikeById = (commentId: number) => {
  const commentLikesById = useCommentLikesStore((store) => store.commentLikesMap);
  return commentLikesById[commentId];
};

export const useCommentLikeSetter = () => {
  return useCommentLikesStore((store) => store.set);
};
