import { useDialog } from '@/context/DialogContext';
import { changePassword } from '@/lib/api/me';
import { MutationProps } from '@/types/custom';
import { useMutation } from '@tanstack/react-query';
import { useOpenLoginDialog } from '../useOpenLoginDialog';
import { extractNextError } from '@/lib/nextError';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';

export function useChangePasswordMutation(
  reset: MutationProps,
  onConfirm: MutationProps
) {
  const openLoginDialog = useOpenLoginDialog();
  const { open: openCommonDialog } = useDialog();

  const { mutate: mutateChangePassword } = useMutation(changePassword, {
    onSuccess: () => {
      reset();
      openCommonDialog({
        title: '비밀번호 변경',
        description: '비밀번호 변경이 완료되었습니다.',
        mode: 'alert',
      });
    },
    onError: async (error, variables) => {
      const extractedError = extractNextError(error);
      if (extractedError.name === 'Forbidden') {
        openCommonDialog({
          title: '비밀번호 불일치',
          description:
            '비밀번호가 일치하지 않습니다.. 현재 비밀번호를 다시 입력해주세요.',
          mode: 'alert',
          onConfirm,
        });
      } else if (extractedError.name === 'BadRequest') {
        openCommonDialog({
          title: '비밀번호 변경 실패',
          description: '8~20자, 영문/숫자/특수문자 1가지 이상 입력해주세요.',
          mode: 'alert',
          onConfirm,
        });
      } else if (
        extractedError.name === 'Unauthorized' &&
        extractedError.payload?.isExpiredToken
      ) {
        try {
          const tokens = await refreshToken();
          setClientCookie(`access_token=${tokens.accessToken}`);
          const { newPassword, oldPassword } = variables;
          mutateChangePassword({ newPassword, oldPassword });
        } catch (innerError) {
          // expire refresh
          openLoginDialog('sessionOut');
        }
      }
    },
  });

  return mutateChangePassword;
}
