'use client';

import BasicLayout from '@/components/layout/BasicLayout';
import LabelInput from '@/components/system/LabelInput';
import WriteFormTemplate from '@/components/write/WriteFormTemplate';
import { useWriteContext } from '@/context/WriteContext';
import { extractUrlsWithProgress } from '@/lib/api/extract';
import { getItem } from '@/lib/api/items';
import { extractNextError } from '@/lib/nextError';
import throttle from 'lodash.throttle';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Params = {
  params: {
    id: string;
  };
};

export default function Edit({ params: { id } }: Params) {
  const router = useRouter();
  const {
    state: { form, error },
    actions,
  } = useWriteContext();
  const [currentLink, setCurrentLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const throttleUpdateProgress = throttle(
    (value: number) => {
      setProgress(value);
    },
    500,
    { leading: true, trailing: true }
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.link || !currentLink) {
      alert('공유할 주소를 입력해주세요.');
      return;
    }
    setIsLoading(true);
    try {
      // Refactor: 만약 이전의 url에서 변경되지 않는 다면 해당 작업을 건너뛰기
      // 해당 url 중 type "image/svg+xml" 이라면 즉, svg 이미지를 로드하려면, dangerouslyAllowSVG를 활성화 시켜야하지만, XSS 공격 위험을 가지므로 고려 x
      const { urls } = await extractUrlsWithProgress(
        form.link,
        throttleUpdateProgress
      );
      // 요청 완료 후 처리
      // console.log(urls);
      if (form.link === currentLink) {
        actions.change('thumbnail', {
          extracted: urls,
          selected: form.thumbnail.selected,
        });
      } else {
        actions.change('link', currentLink);
        actions.change('thumbnail', {
          extracted: urls,
        });
      }
      router.push(`/write/edit/${id}/extract`);
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
  };

  useEffect(() => {
    async function fetchItemData() {
      try {
        const { title, body, link, thumbnail, tags } = await getItem(
          parseInt(id)
        );
        setCurrentLink(link);
        actions.change('title', title);
        // actions.change('body', body); // for test
        actions.change('link', link);
        actions.change('thumbnail', {
          extracted: [],
          selected: thumbnail?.url ?? undefined,
        });
        actions.change('tags', tags);
        actions.change('id', id);
      } catch (e) {
        console.error(extractNextError(e));
      }
    }
    fetchItemData();
  }, [id, actions]);

  return (
    <BasicLayout title='링크 입력' hasBackButton>
      <WriteFormTemplate
        description='공유하고 싶은 URL을 입력하세요'
        buttonText='다음'
        onSubmit={onSubmit}
        isLoading={isLoading}
        loadingPercent={progress}
      >
        <LabelInput
          label='url'
          placeholder='https://example.com'
          // defaultValue={state.url}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setCurrentLink(e.target.value);
          }}
          value={currentLink}
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
