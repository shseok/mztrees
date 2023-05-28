import React from 'react';
import styled from 'styled-components';
import { SearchItemResult } from '~/lib/api/types';

interface Props {
  item: SearchItemResult;
}

const SearchResultCard = ({ item }: Props) => {
  return <Block>{item.title}</Block>;
};

const Block = styled.div``;

export default SearchResultCard;
