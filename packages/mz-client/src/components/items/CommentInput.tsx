import React from 'react';
import styled from 'styled-components';
import { useCommentInputStore } from '~/hooks/store/useCommentInputStore';
import { colors } from '~/lib/colors';

const CommentInput = () => {
  const open = useCommentInputStore((state) => state.open);
  return <DummyInput onClick={open}>댓글을 입력하세요.</DummyInput>;
};

const DummyInput = styled.div`
  width: 100%;
  height: 48px;
  border: 1px solid ${colors.gray2};
  border-radius: 4px;
  padding: 12px 16px 12px 16px;
  display: flex;
  align-items: center;
  color: ${colors.gray1};
  font-size: 16px;
`;

export default CommentInput;
