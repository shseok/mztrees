import React from 'react';
import styled from 'styled-components';
import { useCommentInputStore } from '~/hooks/stores/useCommentInputStore';
import { setUser } from '~/hooks/stores/userStore';
import { useOpenLoginDialog } from '~/hooks/useOpenLoginDialog';
import { getMyAccount } from '~/lib/api/auth';
import { colors } from '~/lib/colors';

const CommentInput = () => {
  const write = useCommentInputStore((state) => state.write);
  const openLoginDialog = useOpenLoginDialog();
  const set = setUser();
  const onClick = async () => {
    const currentUser = await getMyAccount();
    set(currentUser);
    if (!currentUser) {
      openLoginDialog('comment');
      return;
    }
    write();
  };
  return <DummyInput onClick={onClick}>댓글을 입력하세요.</DummyInput>;
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
