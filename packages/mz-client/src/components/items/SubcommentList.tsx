import React from "react";
import { Comment } from "@/types/db";
import CommentItem from "./CommentItem";
import styles from "@/styles/SubcommentList.module.scss";

interface Props {
  comments: Comment[];
}

const SubCommentList = ({ comments }: Props) => {
  if (comments.length === 0) return null;
  return (
    <div className={styles.list}>
      {comments.map((comment) => (
        <CommentItem
          comment={comment}
          key={comment.id}
          isSubcomment
        ></CommentItem>
      ))}
    </div>
  );
};

export default SubCommentList;
