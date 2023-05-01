import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BasicLayout from '~/components/layout/BasicLayout';
import LabelInput from '~/components/system/LabelInput';
import LabelTextArea from '~/components/system/LabelTextArea';
import WriteFormTemplate from '~/components/write/WriteFormTemplate';
import { useWriteContext } from '~/context/WriteContext';
import { createItem } from '~/lib/api/items';

const WriteIntro = () => {
  const [form, setForm] = useState({ title: '', body: '' });
  const {
    state: { link },
  } = useWriteContext();

  const navigate = useNavigate();
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const key = e.target.name as 'title' | 'body';
    const { value } = e.target;
    setForm({ ...form, [key]: value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createItem({ ...form, link });
      navigate('/');
    } catch (e) {
      //...
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
          <StyledLabelTextArea
            label='내용'
            name='body'
            value={form.body}
            onChange={onChange}
          ></StyledLabelTextArea>
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
