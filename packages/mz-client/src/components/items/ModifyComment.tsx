import React, { useState } from 'react';
import CommentEditor from './CommentEditor';
import { useItemId } from '@/hooks/useItemId';
import { useEditCommentMutation } from '@/hooks/mutation/useEditCommnetMutation';

interface Props {
  initialText: string;
  commentId: number;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const ModifyComment = ({
  onClose,
  commentId,
  initialText,
  inputRef,
}: Props) => {
  const itemId = useItemId();
  const [text, setText] = useState(initialText);
  const resetText = () => setText('');

  const { editComment, isEditLoading } = useEditCommentMutation(resetText);

  const onClickEdit = () => {
    if (!itemId) return;
    if (text === '') return;
    editComment({ itemId, commentId, text });
  };

  return (
    <div style={{ paddingLeft: '10px', paddingTop: '16px' }}>
      <CommentEditor
        mode='edit'
        isLoading={isEditLoading}
        onSubmit={onClickEdit}
        text={text}
        setText={setText}
        onClose={onClose}
        inputRef={inputRef}
      />
    </div>
  );
};

export default ModifyComment;
