'use client';

import BasicLayout from '@/components/layout/BasicLayout';
import LabelInput from '@/components/system/LabelInput';
import LabelTextArea from '@/components/system/LabelTextArea';
import TagInput from '@/components/system/TagInput';
import Editor from '@/components/write/Editor';
import PreviewRenderer from '@/components/write/PreviewRenderer';
import WriteFormTemplate from '@/components/write/WriteFormTemplate';
import { useWriteContext } from '@/context/WriteContext';
import { useOpenLoginDialog } from '@/hooks/useOpenLoginDialog';
import { refreshToken } from '@/lib/api/auth';
import { createItem } from '@/lib/api/items';
import { setClientCookie } from '@/lib/client';
import { extractNextError } from '@/lib/nextError';
import styles from '@/styles/WriteIntro.module.scss';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function Intro() {
  const {
    state: { form },
    actions,
  } = useWriteContext();
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<typeof form>();
  const openLoginDialog = useOpenLoginDialog();
  const [errorMessage] = useState<string | null>(null);
  const router = useRouter();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const key = e.target.name as 'title' | 'body';
    const { value } = e.target;
    actions.change(key, value);
  };

  const onSubmit: SubmitHandler<typeof form> = async (data, e) => {
    e?.preventDefault();
    if (form.title === '' || form.body === '') {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }
    if (!form.tags.length) {
      toast.error('해당 웹사이트의 태그를 입력해 주세요');
      return;
    }
    // if (form.thumbnail.extracted.length > 1 && !form.thumbnail.selected) {
    //   // TODO: toast ui로 이미지 선택하라고 알려주기
    //   router.back();
    //   router.refresh();
    // }
    const ItemInfo = {
      title: form.title,
      body: form.body,
      link: form.link,
      thumbnail: form.thumbnail.selected,
      tags: form.tags,
    };
    // request & error
    try {
      const item = await createItem(ItemInfo);
      router.push(`/items/${item.id}`);
    } catch (e) {
      const error = extractNextError(e);
      if (error.name === 'Unauthorized' && error.payload?.isExpiredToken) {
        try {
          const tokens = await refreshToken();
          setClientCookie(`access_token=${tokens.accessToken}`);

          const item = await createItem(ItemInfo);
          router.push(`/items/${item.id}`);
        } catch (innerError) {
          // expire refresh
          openLoginDialog('sessionOut');
        }
      } else if (error.statusCode === 422) {
        router.back();
        router.back();
        actions.setError(error);
      }
      console.log(error);
    }
  };
  const [data, setData] = useState();
  console.log(data);
  return (
    <BasicLayout title='웹사이트 소개' hasBackButton>
      <WriteFormTemplate
        description='공유할 웹사이트를 소개하세요'
        buttonText='등록하기'
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      >
        <div className={styles.group}>
          <TagInput />
          <LabelInput
            label='제목'
            name='title'
            value={form.title}
            onChange={onChange}
          ></LabelInput>
          <LabelTextArea
            className='styled_label_textarea'
            label='내용'
            name='body'
            value={form.body}
            onChange={onChange}
            rows={8}
          />
          {errorMessage ? (
            <div className={styles.message}>{errorMessage}</div>
          ) : null}
        </div>
      </WriteFormTemplate>
      <div style={{ width: '100%', display: 'flex' }}>
        <Editor data={data} onChange={setData} />
        <PreviewRenderer data={data} />
      </div>
    </BasicLayout>
  );
}
