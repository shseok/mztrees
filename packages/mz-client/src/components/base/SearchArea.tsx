import React, { useRef } from 'react';
import styled from 'styled-components';
import { ReactComponent as Search } from '~/assets/search.svg';
import { colors } from '~/lib/colors';

const SearchArea = () => {
  const ref = useRef<HTMLInputElement>(null);

  const onClick = () => {
    ref.current?.focus();
  };

  return (
    <Block>
      <SearchInputWrapper onClick={onClick}>
        <Search />
        <input ref={ref} type='text' />
      </SearchInputWrapper>
    </Block>
  );
};

const Block = styled.div``;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 180px;
  height: 36px;
  padding: 0 8px;
  // border: 1px solid ${colors.gray1};
  border-radius: 5px;
  margin-right: 8px;
  background: #f0f0f0;

  svg {
    width: 20px;
    height: 20px;
    color: ${colors.gray4};
    flex-shrink: 0;
  }

  input {
    flex: 1;
    margin-left: 8px;
    background: none;
    border: none;
    outline: none;
    padding: 0;
    min-width: 0;
  }
`;

export default SearchArea;
