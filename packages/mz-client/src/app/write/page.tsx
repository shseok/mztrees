'use client';

import BasicLayout from '@/components/layout/BasicLayout';
import LabelInput from '@/components/system/LabelInput';
import WriteFormTemplate from '@/components/write/WriteFormTemplate';
import { useWriteContext } from '@/context/WriteContext';
import { extractNextError } from '@/lib/nextError';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import throttle from 'lodash.throttle';
import { extractUrlsWithProgress } from '@/lib/api/extract';

export default function Write() {
  const router = useRouter();
  const {
    state: { form, error },
    actions,
  } = useWriteContext();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const throttleUpdateProgress = throttle(
    (value: number) => {
      setProgress(value);
    },
    500,
    { leading: true, trailing: true }
  );
  return (
    <BasicLayout title='링크 입력' hasBackButton>
      <WriteFormTemplate
        description='공유하고 싶은 URL을 입력하세요'
        buttonText='다음'
        onSubmit={async (e) => {
          e.preventDefault();
          if (!form.link) {
            alert('공유할 주소를 입력해주세요.');
            return;
          }
          setIsLoading(true);
          try {
            // Refactor: 만약 이전의 url에서 변경되지 않는 다면 해당 작업을 건너뛰기
            // 해당 url 중 type "image/svg+xml" 이라면 즉, svg 이미지를 로드하려면, dangerouslyAllowSVG를 활성화 시켜야하지만, XSS 공격 위험을 가지므로 고려 x
            // 아래 edit과 중복..
            const { urls } = await extractUrlsWithProgress(
              form.link,
              throttleUpdateProgress
            );
            // 요청 완료 후 처리
            // console.log(urls);
            actions.change('thumbnail', { extracted: urls });
            router.push('/write/extract');
          } catch (innerError) {
            const error = extractNextError(innerError);
            if (error.statusCode === 422) {
              router.refresh();
              actions.setError(error);
            }
            console.log(error);
          } finally {
            setIsLoading(false);
          }
        }}
        isLoading={isLoading}
        loadingPercent={progress}
      >
        <LabelInput
          label='url'
          placeholder='https://example.com'
          // defaultValue={state.url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            actions.change('link', e.target.value);
          }}
          value={form.link}
          errorMessage={
            error?.statusCode === 422
              ? '유효하지 않은 URL입니다. 다른 URL을 입력해주세요.'
              : undefined
          }
        />
      </WriteFormTemplate>
    </BasicLayout>
  );
}
