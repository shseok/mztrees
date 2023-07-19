import React from "react";
import { useCommentInputStore } from "@/hooks/stores/useCommentInputStore";
import { useOpenLoginDialog } from "@/hooks/useOpenLoginDialog";
import styles from "@/styles/CommentInput.module.scss";
import { useUser } from "@/context/userContext";

const CommentInput = () => {
  const write = useCommentInputStore((state) => state.write);
  const openLoginDialog = useOpenLoginDialog();
  const { currentUser } = useUser();
  const onClick = async () => {
    if (!currentUser) {
      openLoginDialog("comment");
      return;
    }
    write();
  };
  return (
    <div className={styles.dummy_input} onClick={onClick}>
      댓글을 입력하세요.
    </div>
  );
};

export default CommentInput;
