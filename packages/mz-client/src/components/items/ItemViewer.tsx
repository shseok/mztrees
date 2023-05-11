import React from 'react';
import styled from 'styled-components';
import { Item } from '~/lib/api/types';

interface Props {
  item: Item;
}

const ItemViewer = ({ item }: Props) => {
  const { thumbnail } = item;
  return <Block>{thumbnail ? <Thumbnail src={thumbnail} /> : null}</Block>;
};

const Block = styled.div``;
const Thumbnail = styled.img`
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 0px;
`;
export default ItemViewer;
