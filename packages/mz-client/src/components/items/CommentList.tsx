import React from 'react';
import styled from 'styled-components';
import CommentInput from './CommentInput';
import { Comment, User } from '~/lib/api/types';
import CommentItem from './CommentItem';
import { getMyAccount } from '~/lib/api/auth';
import useFetch from '~/hooks/useFetch';

interface Props {
  comments: Comment[];
}

const CommentList = ({ comments }: Props) => {
  // TODO: Change User Info Logic
  const { data, loading, error } = useFetch<User | null>({ getDataFunc: getMyAccount });
  return (
    <Block>
      {loading && <div>로딩중..</div>}
      {error && <div>에러</div>}
      <>
        <CommentTitle>댓글 0개</CommentTitle>
        <CommentInput />
        <List>
          {comments.map((comment) => (
            <CommentItem comment={comment} key={comment.id} user={data} />
          ))}
        </List>
      </>
    </Block>
  );
};

const Block = styled.div`
  padding: 16px;
`;

const CommentTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
`;

const List = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;
export default CommentList;
