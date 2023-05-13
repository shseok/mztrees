import React from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';

const CommentInput = () => {
  return <Block>댓글을 입력하세요.</Block>;
};

const Block = styled.div`
  width: 100%;
  height: 48px;
  border: 1px solid ${colors.gray2};
  border-radius: 4px;
  padding: 12px 16px 12px 16px;
  display: flex;
  align-items: center;
  color: ${colors.gray1};
`;

export default CommentInput;
