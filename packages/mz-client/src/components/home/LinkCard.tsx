import React from 'react';
import styled from 'styled-components';
import { Item } from '~/lib/api/types';

interface Props {
  item: Item;
}

const LinkCard = (props: Props) => {
  return <Block></Block>;
};

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

export default LinkCard;
