import React from 'react';
import styled from 'styled-components';
import { Item } from '~/lib/api/types';
import { colors } from '~/lib/colors';
import { ReactComponent as Globe } from '~/assets/globe.svg';
import { ReactComponent as LikeOutline } from '~/assets/like-outline.svg';
import { useDateDistance } from '~/hooks/useDateDistance';

interface Props {
  item: Item;
}

const LinkCard = ({ item }: Props) => {
  const {
    id,
    thumbnail,
    title,
    body,
    author,
    createdAt,
    user: { username },
    publisher: { favicon, name },
  } = item;

  const dateDistance = useDateDistance(createdAt);
  return (
    <Block>
      {thumbnail ? <Thumbnail src={thumbnail} alt={title} /> : null}
      <Publisher>
        {favicon ? <img src={favicon} alt='favicon' /> : <Globe />}
        {author ? `${author} · ` : ''}
        {name}-{id}
      </Publisher>
      <h3>{item.title}</h3>
      <p>{body}</p>
      <Footer>
        <StyeldLikeOutline />
        <UserInfo>
          by <b>{username}</b> · {dateDistance}
        </UserInfo>
      </Footer>
    </Block>
  );
};

const Block = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.5;
    color: ${colors.gray5};
  }
  p {
    line-height: 1.5;
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 16px;
    color: ${colors.gray4};
  
`;

const Thumbnail = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 288/192;
  object-fit: cover;
  flex: 1;
  border-radius: 12px;
  box-shadow: 0 0 3px rgb(0 0 0 / 15%);
  margin-bottom: 16px;
`;

const Publisher = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.5;
  color: ${colors.gray3};
  font-size: 14px;
  margin-bottom: 4px;
  img,
  svg {
    display: block;
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
`;

const StyeldLikeOutline = styled(LikeOutline)`
  color: ${colors.gray3};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UserInfo = styled.p`
  color: ${colors.gray2};
  font-size: 14px;
`;

export default LinkCard;
