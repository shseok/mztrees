import React from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import { ReactComponent as Search } from '~/assets/search.svg';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

const SearchInput = ({ value, onChangeText }: Props) => {
  return (
    <Block>
      <Search />
      <input
        placeholder='검색어를 입력해주세요.'
        type='text'
        value={value}
        onChange={(e) => {
          onChangeText(e.target.value);
        }}
      />
    </Block>
  );
};

const Block = styled.div`
  width: 100%;
  height: 32px;
  background: ${colors.gray0};
  display: flex;
  align-items: center;
  padding: 0 8px;
  border-radius: 4px;

  svg {
    width: 20px;
    height: 20px;
  }

  input {
    flex: 1;
    margin-left: 8px;
    background: none;
    border: none;
    outline: none;
    padding: 0;
  }
`;

export default SearchInput;
