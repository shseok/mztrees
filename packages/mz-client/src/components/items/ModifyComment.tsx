import React, { useState } from 'react';
import CommentEditor from './CommentEditor';
import { useItemId } from '@/hooks/useItemId';
import { useCommentsQuery } from '@/hooks/query/useCommentsQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editComment } from '@/lib/api/items';
import { useOpenLoginDialog } from '@/hooks/useOpenLoginDialog';
import { useDialog } from '@/context/DialogContext';
import { extractNextError } from '@/lib/nextError';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';

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
  const queryClient = useQueryClient();
  const openLoginDialog = useOpenLoginDialog();
  const { open } = useDialog();

  const { mutate: edit, isLoading } = useMutation(editComment, {
    onSuccess: () => {
      // router.refesh();
      setText('');
      if (!itemId) return;
      queryClient.invalidateQueries(useCommentsQuery.extractKey(itemId));
    },
    onError: async (e, variables) => {
      const error = extractNextError(e);
      if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
        try {
          const tokens = await refreshToken();
          setClientCookie(`access_token=${tokens.accessToken}`);
          const { itemId, commentId, text } = variables;
          edit({ itemId, commentId, text });
        } catch (innerError) {
          // expire refresh
          openLoginDialog('sessionOut');
        }
      } else {
        // 서버가 죽지 않는 이상 에러는 발생하지 않을 것
        open({
          title: '오류',
          description: '댓글 작성 실패',
        });
      }
    },
  });

  const onClickEdit = () => {
    if (!itemId) return;
    if (text === '') return;
    edit({ itemId, commentId, text });
  };

  return (
    <div style={{ paddingLeft: '10px', paddingTop: '16px' }}>
      <CommentEditor
        mode='edit'
        isLoading={isLoading}
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
