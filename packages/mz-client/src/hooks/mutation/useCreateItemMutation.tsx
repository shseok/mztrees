import { refreshToken } from '@/lib/api/auth';
import { createItem } from '@/lib/api/items';
import { setClientCookie } from '@/lib/client';
import { extractNextError } from '@/lib/nextError';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useOpenLoginDialog } from '../useOpenLoginDialog';
import { toast } from 'sonner';

export function useCreateItemMutation() {
  const router = useRouter();
  const openLoginDialog = useOpenLoginDialog();
  const { mutate: mutateCreateItem } = useMutation(createItem, {
    onSuccess: (data) => {
      router.push(`/items/${data.id}`);
    },
    onError: async (e, variables) => {
      const error = extractNextError(e);
      if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
        try {
          const tokens = await refreshToken();
          setClientCookie(`access_token=${tokens.accessToken}`);

          const item = await createItem(variables);
          router.push(`/items/${item.id}`);
        } catch (innerError) {
          // expire refresh
          openLoginDialog('sessionOut');
        }
      } else if (error.statusCode === 422) {
        router.back();
        router.back();
        // actions.setError(error);
        toast.error(error.message);
      }
      console.log(error);
    },
  });

  return mutateCreateItem;
}
