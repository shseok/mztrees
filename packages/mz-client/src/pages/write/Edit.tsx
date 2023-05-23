import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BasicLayout from '~/components/layout/BasicLayout';
import LabelInput from '~/components/system/LabelInput';
import LabelTextArea from '~/components/system/LabelTextArea';
import WriteFormTemplate from '~/components/write/WriteFormTemplate';
import { updateItem } from '~/lib/api/items';

const Edit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { title, body, id } = location.state?.item;
  const [form, setForm] = useState({
    title,
    body,
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  console.log(location.state?.item);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const key = e.target.name as keyof typeof form;
    const { value } = e.target;
    setForm({ ...form, [key]: value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (form.title === '' || form.body === '') {
      setErrorMessage('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      await updateItem({ itemId: id, ...form });
      navigate(-1);
    } catch (e) {
      // TODO: handle error
      console.error(e);
    }
  };

  return (
    <BasicLayout title='수정' hasBackButton>
      <WriteFormTemplate buttonText='수정하기' onSubmit={onSubmit}>
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

export default Edit;
