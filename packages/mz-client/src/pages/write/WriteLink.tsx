import React from 'react';
import { useNavigate } from 'react-router-dom';
import BasicLayout from '~/components/layout/BasicLayout';
import LabelInput from '~/components/system/LabelInput';
import WriteFormTemplate from '~/components/write/WriteFormTemplate';
import { useWriteContext } from '~/context/WriteContext';

const WriteLink = () => {
  const navigation = useNavigate();
  const { state, actions } = useWriteContext();

  return (
    <BasicLayout title='링크 입력' hasBackButton>
      <WriteFormTemplate
        description='공유하고 싶은 URL을 입력하세요'
        buttonText='다음'
        onSubmit={(e) => {
          e.preventDefault();
          navigation('/write/intro');
        }}
      >
        <LabelInput
          label='url'
          placeholder='https://example.com'
          // defaultValue={state.url}
          onChange={(e) => {
            actions.change('link', e.target.value);
          }}
          value={state.form.link}
          errorMessage={state.error?.statusCode === 422 ? '유효하지 않은 URL입니다.' : undefined}
        />
      </WriteFormTemplate>
    </BasicLayout>
  );
};

export default WriteLink;
