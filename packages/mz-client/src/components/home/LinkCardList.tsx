import React from 'react';
import styled from 'styled-components';
import { Item } from '~/lib/api/types';
import LinkCard from './LinkCard';
import { media } from '~/lib/media';

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
  // display: flex;
  // flex-direction: column;
  // grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));

  display: grid;
  grid-template-columns: repeat(1, 1fr);
  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
  ${media.desktop} {
    grid-template-columns: repeat(3, 1fr);
  }
  ${media.widescreen} {
    grid-template-columns: repeat(4, 1fr);
  }
  gap: 24px;
  row-gap: 48px;
`;

export default LinkCardList;
