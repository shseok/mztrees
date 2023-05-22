import React, { useEffect, useState } from 'react';
import Overlay from '../system/Overlay';
import styled from 'styled-components';
import { AnimatePresence, motion } from 'framer-motion';
import { useCommentInputStore } from '~/hooks/stores/useCommentInputStore';
import { colors } from '~/lib/colors';
import { shallow } from 'zustand/shallow';
import { useItemId } from '~/hooks/useItemId';
import { useCreateCommentMutation } from '~/hooks/mutation/useCreateCommentMutations';
import LoadingIndicator from '../system/LoadingIndicator';
import { useQueryClient } from '@tanstack/react-query';
import { useCommentsQuery } from '~/hooks/query/useCommentsQuery';
import { Comment } from '~/lib/api/types';
import { produce } from 'immer';
import { useDialog } from '~/context/DialogContext';

const CommentInputOverlay = () => {
  const { visible, close, parentCommentId } = useCommentInputStore(
    ({ visible, close, parentCommentId }) => ({ visible, close, parentCommentId }),
    shallow,
  );
  // manage text state
  const [text, setText] = useState('');
  const itemId = useItemId();
  const queryClient = useQueryClient();

  const scrollToCommentId = (commentId: number) => {
    const commentElement = document.body.querySelector<HTMLDivElement>(
      `[data-comment-id="${commentId}"]`,
    );
    if (!commentElement) return;
    commentElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
    commentElement.focus();
  };
  const { open } = useDialog();

  const { mutate, isLoading } = useCreateCommentMutation({
    onSuccess: (data) => {
      // TODO: do something with data
      if (!itemId) return;
      const queryKey = useCommentsQuery.extractKey(itemId);
      queryClient.setQueryData(queryKey, (prevComments: Comment[] | undefined) => {
        if (!prevComments) return;
        if (parentCommentId) {
          // parentCommentId를 가진 comment에다가 data를 추가시켜줘야한다. > 가장 위에서 부터 존재하면 넣어주기
          return produce(prevComments, (draft) => {
            const rootComment =
              draft.find((comment) => comment.id === parentCommentId) ?? // 첫번째에 발견된 0 level comments
              draft.find((comment) =>
                comment.subcomments?.find((subcomment) => subcomment.id === parentCommentId),
              ); // 다음 subcomments에서 발견
            rootComment?.subcomments?.push(data);
          });
        } else {
          return [...prevComments, data];
        }
      });
      // queryClient.invalidateQueries(queryKey);
      setTimeout(() => {
        // 현재 코드 실행 블록이 완료된 다음에 호출되며, 이는 대개 현재의 이벤트 루프 주기가 종료된 후에 발생
        scrollToCommentId(data.id);
      }, 0);
      close();
    },
    onError: () => {
      // 서버가 죽지 않는 이상 에러는 발생하지 않을 것
      open({
        title: '오류',
        description: '댓글 작성 실패',
      });
    },
  });

  const onClick = () => {
    if (!itemId) return;
    if (text.length === 0) {
      open({
        title: '오류',
        description: '댓글을 입력하지 않으셨습니다.',
      });
      return;
    }
    mutate({
      itemId,
      text,
      parentCommentId: parentCommentId ?? undefined,
    });
  };

  useEffect(() => {
    if (visible) {
      setText('');
    }
  }, [visible]);

  return (
    <>
      <Overlay visible={visible} onClose={close} />
      <AnimatePresence initial={false}>
        {visible && (
          <Footer
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{
              damping: 0,
            }}
          >
            <Input
              placeholder='댓글을 입력하세요.'
              onChange={(e) => setText(e.target.value)}
              value={text}
              autoFocus
            />
            <TransparentButton onClick={onClick} disabled={isLoading}>
              {isLoading ? <LoadingIndicator /> : '등록'}
            </TransparentButton>
          </Footer>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = styled(motion.div)`
  position fixed;
  bottom: 0;
  height: 48px;
  width: 100%;
  background: white;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;
  padding: 0;
  padding-left: 16px;
  font-size: 16px;
  color: ${colors.gray5};
  &::placeholder {
    color: ${colors.gray1};
  }
`;

const TransparentButton = styled.button`
  width: 60px;
  height: 100%;
  color: ${colors.primary};
  font-size: 16px;
  font-weight: 600;
  padding-left: 16px;
  padding-right: 16px;
`;
export default CommentInputOverlay;
