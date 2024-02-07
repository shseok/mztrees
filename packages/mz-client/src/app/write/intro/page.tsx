'use client';

import type { OutputData } from '@editorjs/editorjs';
import BasicLayout from '@/components/layout/BasicLayout';
import LabelInput from '@/components/system/LabelInput';
import LabelTextArea from '@/components/system/LabelTextArea';
import TagInput from '@/components/system/TagInput';
import Editor from '@/components/write/Editor';
import WriteFormTemplate from '@/components/write/WriteFormTemplate';
import { useWriteContext } from '@/context/WriteContext';
import { useOpenLoginDialog } from '@/hooks/useOpenLoginDialog';
import styles from '@/styles/WriteIntro.module.scss';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Content from '@/components/write/Content';
import type { FormType } from '@/types/db';
import TextareaAutosize from 'react-textarea-autosize';
import { useCreateItemMutation } from '@/hooks/mutation/useCreateItemMutation';

// TODO: 임시저장 만들기
export default function Intro() {
  const {
    state: { form },
    actions,
  } = useWriteContext();
  const ItemInfo = {
    title: form.title,
    body: form.body,
    link: form.link,
    thumbnail: form.thumbnail.selected,
    tags: form.tags,
  };
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormType>({
    defaultValues: ItemInfo,
  });
  const [errorMessage] = useState<string | null>(null);
  const [data, setData] = useState<OutputData>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const { ref: titleRef, ...rest } = register('title');
  const creactItem = useCreateItemMutation();

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const key = e.target.name as 'title' | 'body';
    const { value } = e.target;
    actions.change(key, value);
  };

  const onSubmit: SubmitHandler<FormType> = async (data, e) => {
    e?.preventDefault();
    const { title, body } = data;

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
    // request & error
    creactItem(ItemInfo);
  };

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast.error('제목, 내용, 태그를 모두 입력해주세요');
      }
    }
  }, [errors]);
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
          {/* <TagInput />
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
          /> */}
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder='제목을 입력하세요'
            className={styles.title}
          />
          <TagInput />
          <Editor
            data={data}
            onChange={setData}
            titleRef={_titleRef}
            register={register}
          />
          {/* <div style={{ minHeight: '500px', flex: 1 }}>
            {data &&
              data.blocks?.map((block) => (
                <Content block={block} key={block.id} />
              ))}
          </div> */}
          {errorMessage ? (
            <div className={styles.message}>{errorMessage}</div>
          ) : null}
        </div>
      </WriteFormTemplate>
    </BasicLayout>
  );
}
