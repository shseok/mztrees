import React, { useState } from 'react';
import { useCreateCommentMutation } from '@/hooks/mutation/useCreateCommentMutation';
import { useItemId } from '@/hooks/useItemId';
import CommentEditor from './CommentEditor';

interface Props {
  parentCommentId: number;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ReplyComment = ({ parentCommentId, onClose, inputRef }: Props) => {
  const itemId = useItemId();
  const [text, setText] = useState('');
  const resetText = () => setText('');
  const { writeComment, isWriteLoading } = useCreateCommentMutation(resetText);

  const onClickWrite = () => {
    if (!itemId) return;
    if (text === '') return;
    writeComment({ itemId, text, parentCommentId });
  };

  return (
    <div style={{ paddingLeft: '10px', paddingTop: '16px' }}>
      <CommentEditor
        mode='reply'
        isLoading={isWriteLoading}
        onSubmit={onClickWrite}
        text={text}
        setText={setText}
        onClose={onClose}
        inputRef={inputRef}
      />
    </div>
  );
};

export default ReplyComment;
