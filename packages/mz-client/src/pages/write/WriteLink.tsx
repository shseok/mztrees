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
          actions.setUrl(e.currentTarget.url.value);
          // navigation을 하면 e.prevent.. 를 안해줘도 되네??
          navigation('/write/intro');
        }}
      >
        <LabelInput
          label='url'
          placeholder='https://example.com'
          name='url'
          defaultValue={state.url}
        />
      </WriteFormTemplate>
    </BasicLayout>
  );
};

export default WriteLink;
