import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDialog } from '~/context/DialogContext';

const messageMap = {
  itemLike: '이 글이 마음에 드시나요? 이 글을 다른 사람들에게도 추천하기 위해서 로그인을 해주세요.',
  comment: '당신의 의견을 적고 싶으신가요? 로그인을 해주세요.',
  commentLike: '이 댓글이 마음에 드세요? 로그인을 해주세요',
  itemBookmark: '나중에 이 글을 또 보고 싶으신가요? 로그인하고 북마크를 추가해보세요.',
};

export const useOpenLoginDialog = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { open } = useDialog();

  const openLoginDialog = useCallback(
    (type: keyof typeof messageMap) => {
      const description = messageMap[type];
      open({
        title: '로그인 후 이용해 주세요.',
        description,
        confirmText: '로그인',
        onConfirm: () => {
          /**@todos refactor like useProtectedRoute or use useProtectedRoute */
          navigate('/login', { state: { from: location, redirect: '/' }, replace: true });
        },
        mode: 'confirm',
      });
    },
    [navigate, open],
  );

  return openLoginDialog;
};
