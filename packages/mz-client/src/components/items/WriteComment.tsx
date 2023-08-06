import React, { useState } from "react";
import { useCreateCommentMutation } from "@/hooks/mutation/useCreateCommentMutations";
import { useItemId } from "@/hooks/useItemId";
import { useQueryClient } from "@tanstack/react-query";
import { useCommentsQuery } from "@/hooks/query/useCommentsQuery";
import CommentEditor from "./CommentEditor";
import { useOpenLoginDialog } from "@/hooks/useOpenLoginDialog";
import { useDialog } from "@/context/DialogContext";
import { extractNextError } from "@/lib/nextError";
import { refreshToken } from "@/lib/api/auth";
import { setClientCookie } from "@/lib/client";

const WriteComment = () => {
  const itemId = useItemId();
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const openLoginDialog = useOpenLoginDialog();
  const { open } = useDialog();

  const { mutate: writeComment, isLoading } = useCreateCommentMutation({
    onSuccess: () => {
      // router.refesh();
      setText("");
      queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId!));
    },
    onError: async (e, variables) => {
      const error = extractNextError(e);
      if (error.name === "Unauthorized" && error.payload?.isExpiredToken) {
        try {
          const tokens = await refreshToken();
          setClientCookie(`access_token=${tokens.accessToken}`);
          const { itemId, text } = variables;
          writeComment({ itemId, text });
        } catch (innerError) {
          // expire refresh
          openLoginDialog("sessionOut");
        }
      } else {
        // 서버가 죽지 않는 이상 에러는 발생하지 않을 것
        open({
          title: "오류",
          description: "댓글 작성 실패",
        });
      }
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
