import React, { useState } from "react";
import { useCreateCommentMutation } from "@/hooks/mutation/useCreateCommentMutations";
import { useItemId } from "@/hooks/useItemId";
import { useQueryClient } from "@tanstack/react-query";
import { useCommentsQuery } from "@/hooks/query/useCommentsQuery";
import CommentEditor from "./CommentEditor";

const WriteComment = () => {
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
    writeComment({ itemId, text });
  };

  return (
    <CommentEditor
      mode="write"
      isLoading={isLoading}
      onSubmit={onClickWrite}
      text={text}
      setText={setText}
    />
  );
};

export default WriteComment;
