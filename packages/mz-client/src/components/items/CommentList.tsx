import React from "react";
import CommentInput from "./CommentInput";
import { Comment } from "@/types/db";
import CommentItem from "./CommentItem";
import styles from "@/styles/CommentList.module.scss";

interface Props {
  comments: Comment[];
}

const CommentList = ({ comments }: Props) => {
  const totalComments = (
    comments.length +
    comments.reduce((prev, cur) => prev + cur.subcommentsCount, 0)
  ).toLocaleString();
  return (
    <div className={styles.block}>
      <h3 className={styles.comment_title}>댓글 {totalComments}개</h3>
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
