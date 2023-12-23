'use client';

import BasicLayout from '@/components/layout/BasicLayout';
import React, { useState } from 'react';
import styles from '@/styles/EditIntro.module.scss';
import { useRouter } from 'next/navigation';
import { updateItem } from '@/lib/api/items';
import { extractNextError } from '@/lib/nextError';
import { refreshToken } from '@/lib/api/auth';
import { setClientCookie } from '@/lib/client';
import { useOpenLoginDialog } from '@/hooks/useOpenLoginDialog';
import WriteFormTemplate from '@/components/write/WriteFormTemplate';
import LabelInput from '@/components/system/LabelInput';
import LabelTextArea from '@/components/system/LabelTextArea';
import { useWriteContext } from '@/context/WriteContext';
import TagInput from '@/components/system/TagInput';
import { toast } from 'sonner';

export default function EditIntro() {
  const {
    state: { form },
    actions,
  } = useWriteContext();
  const openLoginDialog = useOpenLoginDialog();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (e) => {
    const key = e.target.name as 'title' | 'body';
    const { value } = e.target;
    actions.change(key, value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (form.title === '' || form.body === '') {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }
    if (!form.tags.length) {
      toast.error('해당 웹사이트의 태그를 입력해 주세요');
      return;
    }

    if (!form.id) return;
    const ItemInfo = {
      title: form.title,
      body: form.body,
      link: form.link,
      thumbnail: form.thumbnail.selected,
      tags: form.tags,
    };

    try {
      setIsSubmitting(true);
      await updateItem(parseInt(form.id), ItemInfo);
      router.push(`/items/${form.id}`);
      router.refresh();
    } catch (e) {
      // TODO: refactor erorr like "getMyAccountWithRefresh"
      const error = extractNextError(e);
      // access token expired
      if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
        try {
          const tokens = await refreshToken();
          setClientCookie(`access_token=${tokens.accessToken}`);

          await updateItem(parseInt(form.id), ItemInfo);
          router.back();
        } catch (innerError) {
          openLoginDialog('edit');
        }
      } else {
        openLoginDialog('edit');
      }
      console.log(extractNextError(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BasicLayout title='수정' hasBackButton>
      <WriteFormTemplate
        buttonText='수정하기'
        onSubmit={onSubmit}
        isLoading={isSubmitting}
      >
        <div className={styles.group}>
          <TagInput />
          <LabelInput
            label='제목'
            name='title'
            onChange={onChange}
            value={form.title}
          />
          <LabelTextArea
            className='styled_label_textarea'
            label='내용'
            name='body'
            value={form.body}
            onChange={onChange}
            rows={8}
          />
        </div>
      </WriteFormTemplate>
    </BasicLayout>
  );
}
