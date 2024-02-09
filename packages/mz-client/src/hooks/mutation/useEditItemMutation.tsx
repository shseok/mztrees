import { useRouter } from 'next/navigation';
import { useOpenLoginDialog } from '../useOpenLoginDialog';
import { useMutation } from '@tanstack/react-query';
import { updateItem } from '@/lib/api/items';
import { extractNextError } from '@/lib/nextError';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';

export function useEditItemMutation() {
  const router = useRouter();
  const openLoginDialog = useOpenLoginDialog();
  const { mutate: mutateEditItem, isLoading } = useMutation(updateItem, {
    onSuccess: (data) => {
      router.push(`/items/${data.id}`);
      router.refresh();
    },
    onError: async (e, variables) => {
      const error = extractNextError(e);
      // access token expired
      if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
        try {
          const tokens = await refreshToken();
          setClientCookie(`access_token=${tokens.accessToken}`);
          const { itemId, params } = variables;
          await updateItem({ itemId, params });
          router.back();
        } catch (innerError) {
          openLoginDialog('edit');
        }
      } else {
        openLoginDialog('edit');
      }
      console.log(extractNextError(e));
    },
  });

  return { mutateEditItem, isLoading };
}
