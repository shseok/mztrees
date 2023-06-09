import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BasicLayout from '~/components/layout/BasicLayout';
import LabelInput from '~/components/system/LabelInput';
import LabelTextArea from '~/components/system/LabelTextArea';
import WriteFormTemplate from '~/components/write/WriteFormTemplate';
import { useWriteContext } from '~/context/WriteContext';
import { createItem } from '~/lib/api/items';
import { extractError } from '~/lib/error';

const WriteIntro = () => {
  const {
    state: { form },
    actions,
  } = useWriteContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const key = e.target.name as 'title' | 'body';
    const { value } = e.target;
    actions.change(key, value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.title === '' || form.body === '') {
      setErrorMessage('제목과 내용을 모두 입력해주세요.');
      return;
    }

    // request & error
    try {
      const item = await createItem(form);
      navigate(`/items/${item.id}`);
    } catch (e) {
      const error = extractError(e);
      if (error.statusCode === 422) {
        navigate(-1);
        actions.setError(error);
      }
    }
  };

  return (
    <BasicLayout title='뉴스 소개' hasBackButton>
      <WriteFormTemplate
        description='공유할 뉴스를 소개하세요'
        buttonText='등록하기'
        onSubmit={onSubmit}
      >
        <Group>
          <LabelInput label='제목' name='title' value={form.title} onChange={onChange}></LabelInput>
          <StyledLabelTextArea label='내용' name='body' value={form.body} onChange={onChange} />
          {errorMessage ? <Message>{errorMessage}</Message> : null}
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

const Message = styled.div`
  color: red;
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;

export default WriteIntro;
