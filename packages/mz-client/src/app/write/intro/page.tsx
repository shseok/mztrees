'use client';

import type { OutputData } from '@editorjs/editorjs';
import type { FormValue } from '@/types/db';
import styles from '@/styles/WriteIntro.module.scss';
import BasicLayout from '@/components/layout/BasicLayout';
import TagInput from '@/components/system/TagInput';
import WriteFormTemplate from '@/components/write/WriteFormTemplate';
import { useWriteContext } from '@/context/WriteContext';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useCreateItemMutation } from '@/hooks/mutation/useCreateItemMutation';
import TextareaAutosize from 'react-textarea-autosize';
import Button from '@/components/system/Button';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/write/Editor'), {
  ssr: false,
});

export default function Intro() {
  const {
    state: { form },
  } = useWriteContext();
  const { register, watch, setValue, handleSubmit } = useForm<FormValue>({
    defaultValues: { title: form.title },
  });

  // const [errorMessage] = useState<string | null>(null);
  const [bodyData, setBodyData] = useState<OutputData>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const { ref: titleRef, ...rest } = register('title');
  const { mutateCreateItem, isLoading } = useCreateItemMutation();
  const watchedTitle = watch('title');

  const onSubmit: SubmitHandler<FormValue> = async (data, e) => {
    e?.preventDefault();
    const { title } = data;
    const {
      tags,
      link,
      body,
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
    // if (form.thumbnail.extracted.length > 1 && !form.thumbnail.selected) {
    //   // TODO: toast ui로 이미지 선택하라고 알려주기
    //   router.back();
    //   router.refresh();
    // }
    localStorage.removeItem('writeData');
    mutateCreateItem({
      title,
      body: JSON.stringify(bodyData ?? body),
      link,
      thumbnail: selected,
      tags,
    });
  };
  // 임시저장 with localStorage
  const onSave = () => {
    localStorage.setItem(
      'writeData',
      JSON.stringify({
        title: watchedTitle,
        body: bodyData,
        tags: form.tags,
      })
    );
    toast.success('임시 저장되었습니다');
  };

  useEffect(() => {
    setValue('title', form.title);
  }, [form.title]);

  return (
    <BasicLayout title='웹사이트 소개' hasBackButton>
      <WriteFormTemplate
        description='공유할 웹사이트를 소개하세요'
        buttonText='등록하기'
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
