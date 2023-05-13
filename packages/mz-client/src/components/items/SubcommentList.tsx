import React from 'react';
import styled from 'styled-components';
import { Comment } from '~/lib/api/types';
import CommentItem from './CommentItem';

interface Props {
  comments: Comment[];
}

const SubCommentList = ({ comments }: Props) => {
  if (comments.length === 0) return null;
  return (
    <List>
      {comments.map((comment) => (
        <CommentItem comment={comment} key={comment.id} isSubcomment></CommentItem>
      ))}
    </List>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-left: 24px;
  padding-top: 12px;
`;

export default SubCommentList;
