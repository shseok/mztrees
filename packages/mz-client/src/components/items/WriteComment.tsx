import { useState } from 'react';
import { useCreateCommentMutation } from '@/hooks/mutation/useCreateCommentMutation';
import { useItemId } from '@/hooks/useItemId';
import CommentEditor from './CommentEditor';

const WriteComment = () => {
  const itemId = useItemId();
  const [text, setText] = useState('');
  const resetText = () => setText('');
  const { writeComment, isWriteLoading } = useCreateCommentMutation(resetText);

  const onClickWrite = () => {
    if (!itemId) return;
    if (text === '') return;
    writeComment({ itemId, text });
  };

  return (
    <CommentEditor
      mode='write'
      isLoading={isWriteLoading}
      onSubmit={onClickWrite}
      text={text}
      setText={setText}
    />
  );
};

export default WriteComment;
