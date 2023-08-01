import { useCreateCommentMutation } from "@/hooks/mutation/useCreateCommentMutations";
import { useCommentsQuery } from "@/hooks/query/useCommentsQuery";
import { useItemId } from "@/hooks/useItemId";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import CommentEditor from "./CommentEditor";
import { useDeskTopCommentInputStore } from "@/hooks/stores/useDeskTopCommentInputStore";
import { shallow } from "zustand/shallow";

interface Props {
  parentCommentId: number;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ReplyComment = ({ parentCommentId, onClose, inputRef }: Props) => {
  const itemId = useItemId();
  const { defaultText } = useDeskTopCommentInputStore(
    ({ defaultText, visible }) => ({
      defaultText,
      visible,
    }),
    shallow
  );
  const [text, setText] = useState(defaultText);
  const queryClient = useQueryClient();

  const { mutate: writeComment, isLoading } = useCreateCommentMutation({
    onSuccess: () => {
      // router.refesh();
      setText("");
      queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId!));
    },
  });

  const onClickWrite = () => {
    if (!itemId) return;
    if (text === "") return;
    writeComment({ itemId, text, parentCommentId });
  };

  return (
    <div style={{ paddingLeft: "16px", paddingTop: "16px" }}>
      <CommentEditor
        mode="reply"
        isLoading={isLoading}
        onSubmit={onClickWrite}
        text={text}
        setText={setText}
        onClose={onClose}
        inputRef={inputRef}
      />
    </div>
  );
};

export default ReplyComment;
