import React from 'react';
import styled from 'styled-components';

const CommentList = () => {
  return (
    <Block>
      <CommentTitle>Comment List</CommentTitle>
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
export default CommentList;
