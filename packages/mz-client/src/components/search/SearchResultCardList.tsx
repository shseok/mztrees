import React from 'react';
import styled from 'styled-components';
import { SearchItemResult } from '~/lib/api/types';
import SearchResultCard from './SearchResultCard';

interface Props {
  items: SearchItemResult[];
}

const SearchResultCardList = ({ items }: Props) => {
  return (
    <Block>
      {items.map((item) => (
        <SearchResultCard item={item} key={item.id} />
      ))}
    </Block>
  );
};

const Block = styled.div`
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export default SearchResultCardList;
