import React from 'react';
import styled from 'styled-components';
import { Item } from '~/lib/api/types';
import LinkCard from './LinkCard';

interface Props {
  items: Item[];
}

const LinkCardList = ({ items }: Props) => {
  return (
    <List>
      {items.map((item) => (
        <LinkCard key={item.id} item={item} />
      ))}
    </List>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

export default LinkCardList;
