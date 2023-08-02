import React, { useState } from "react";
import CommentEditor from "./CommentEditor";
import { useItemId } from "@/hooks/useItemId";
import { useCommentsQuery } from "@/hooks/query/useCommentsQuery";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editComment } from "@/lib/api/items";

interface Props {
  initialText: string;
  commentId: number;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ModifyComment = ({
  onClose,
  commentId,
  initialText,
  inputRef,
}: Props) => {
  const itemId = useItemId();
  const [text, setText] = useState(initialText);
  const queryClient = useQueryClient();

  const { mutate: edit, isLoading } = useMutation(editComment, {
    onSuccess: () => {
      // router.refesh();
      setText("");
      if (!itemId) return;
      queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId));
    },
    onError: (error, variables, context) => {
      console.log("modifyComment Error");
    },
  });

  const onClickEdit = () => {
    if (!itemId) return;
    if (text === "") return;
    edit({ itemId, commentId, text });
  };

  return (
    <div style={{ paddingLeft: "10px", paddingTop: "16px" }}>
      <CommentEditor
        mode="edit"
        isLoading={isLoading}
        onSubmit={onClickEdit}
        text={text}
        setText={setText}
        onClose={onClose}
        inputRef={inputRef}
      />
    </div>
  );
};

export default ModifyComment;
