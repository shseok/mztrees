import { useCreateCommentMutation } from "@/hooks/mutation/useCreateCommentMutations";
import { useCommentsQuery } from "@/hooks/query/useCommentsQuery";
import { useItemId } from "@/hooks/useItemId";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import CommentEditor from "./CommentEditor";

interface Props {
  parentCommentId: number;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ReplyComment = ({ parentCommentId, onClose, inputRef }: Props) => {
  const itemId = useItemId();
  const [text, setText] = useState("");
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
    <div style={{ paddingLeft: "10px", paddingTop: "16px" }}>
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
