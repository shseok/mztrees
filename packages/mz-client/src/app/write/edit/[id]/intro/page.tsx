'use client';

import BasicLayout from '@/components/layout/BasicLayout';
import styles from '@/styles/EditIntro.module.scss';
import WriteFormTemplate from '@/components/write/WriteFormTemplate';
import TextareaAutosize from 'react-textarea-autosize';
import { useWriteContext } from '@/context/WriteContext';
import TagInput from '@/components/system/TagInput';
import { toast } from 'sonner';
import { useEditItemMutation } from '@/hooks/mutation/useEditItemMutation';
import { useRef, useState } from 'react';
import type { OutputData } from '@editorjs/editorjs';
import dynamic from 'next/dynamic';
import Button from '@/components/system/Button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormValue } from '@/types/db';

const Editor = dynamic(() => import('@/components/write/Editor'), {
  ssr: false,
});

export default function EditIntro() {
  const {
    state: { form },
  } = useWriteContext();
  const { register, watch, handleSubmit } = useForm<FormValue>({
    defaultValues: { title: form.title },
  });

  const [bodyData, setBodyData] = useState<OutputData>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const { mutateEditItem, isLoading } = useEditItemMutation();
  const { ref: titleRef, ...rest } = register('title');
  const watchedTitle = watch('title');

  const onSubmit: SubmitHandler<FormValue> = async (data, e) => {
    e?.preventDefault();
    const { title } = data;
    const {
      id,
      body,
      tags,
      link,
      thumbnail: { selected },
    } = form;
    if (
      !title ||
      !(bodyData?.blocks.length ?? body?.blocks.length) ||
      tags.length === 0
    ) {
      toast.error('제목, 내용, 태그를 모두 입력해주세요');
      return;
    }
    localStorage.removeItem('writeData');
    if (!id) return;
    mutateEditItem({
      itemId: parseInt(id),
      params: {
        title,
        body: JSON.stringify(bodyData ?? body),
        tags,
        link,
        thumbnail: selected,
      },
    });
  };

  // 임시저장 with localStorage
  const onSave = () => {
    localStorage.setItem(
      'writeData',
      JSON.stringify({
        title: form.title,
        body: bodyData,
        tags: form.tags,
      })
    );
    toast.success('임시 저장되었습니다');
  };

  return (
    <BasicLayout title='수정' hasBackButton>
      <WriteFormTemplate
        buttonText='수정하기'
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isLoading}
      >
        <div className={styles.group}>
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              // @ts-expect-error NOTE: current는 읽기 전용속성 타입이므로 ts-expect-error 를 사용한다.
              _titleRef.current = e;
            }}
            {...rest}
            value={watchedTitle}
            placeholder='제목을 입력하세요'
            className={styles.title}
          />
          <TagInput />
          <Editor
            data={bodyData ?? form.body}
            onChange={setBodyData}
            titleRef={_titleRef}
          />
          <Button
            type='button'
            aria-label='임시 저장'
            layoutmode='fullWidth'
            variant='secondary'
            onClick={onSave}
          >
            임시저장
          </Button>
        </div>
      </WriteFormTemplate>
    </BasicLayout>
  );
}
