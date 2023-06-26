import React from "react";
import CommentInput from "./CommentInput";
import { Comment } from "@/lib/api/types";
import CommentItem from "./CommentItem";
import styles from "@/styles/CommentList.module.scss";

interface Props {
  comments: Comment[];
}

const CommentList = ({ comments }: Props) => {
  return (
    <div className={styles.block}>
      <h3 className={styles.comment_title}>댓글 {comments.length}개</h3>
      <CommentInput />
      <div className={styles.list}>
        {comments.map((comment) => (
          <CommentItem comment={comment} key={comment.id} />
        ))}
      </div>
    </div>
  );
};

export default CommentList;
