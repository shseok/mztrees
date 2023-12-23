import React from 'react';
import { useCommentInputStore } from '@/hooks/stores/useCommentInputStore';
import { useOpenLoginDialog } from '@/hooks/useOpenLoginDialog';
import styles from '@/styles/CommentInput.module.scss';
import { useUser } from '@/context/UserContext';
import WriteComment from './WriteComment';

const CommentInput = () => {
  const write = useCommentInputStore((state) => state.write);
  const openLoginDialog = useOpenLoginDialog();
  const { currentUser } = useUser();
  const onClickDummyInput = async () => {
    if (!currentUser) {
      openLoginDialog('comment');
      return;
    }
    write();
  };
  return (
    <>
      <WriteComment />
      <div className={styles.dummy_input} onClick={onClickDummyInput}>
        댓글을 입력하세요.
      </div>
    </>
  );
};

export default CommentInput;
