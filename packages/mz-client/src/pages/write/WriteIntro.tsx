import React from 'react';
import styled from 'styled-components';
import BasicLayout from '~/components/layout/BasicLayout';
import LabelInput from '~/components/system/LabelInput';
import LabelTextArea from '~/components/system/LabelTextArea';
import WriteFormTemplate from '~/components/write/WriteFormTemplate';

const WriteIntro = () => {
  return (
    <BasicLayout title='뉴스 소개' hasBackButton>
      <WriteFormTemplate
        description='공유할 뉴스를 소개하세요'
        buttonText='등록하기'
        onSubmit={(e) => {
          e.preventDefault();
          const title = (e.currentTarget.title as unknown as HTMLInputElement).value;
          const body = e.currentTarget.body.value;

          console.log(title, body);
        }}
      >
        <Group>
          <LabelInput label='제목' name='title'></LabelInput>
          <StyledLabelTextArea label='내용' name='body'></StyledLabelTextArea>
        </Group>
      </WriteFormTemplate>
    </BasicLayout>
  );
};

const Group = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
`;

const StyledLabelTextArea = styled(LabelTextArea)`
  flex: 1;

  textarea {
    flex: 1;
    resize: none;
    font-family: inherit;
  }
`;

export default WriteIntro;
