import React from 'react';
import styled from 'styled-components';
import { Item } from '~/lib/api/types';
import { colors } from '~/lib/colors';
import { ReactComponent as Globe } from '~/assets/globe.svg';
import { useDateDistance } from '~/hooks/useDateDistance';
import { useLikeManager } from '~/hooks/useLikeManager';
import LikeButton from '../system/LikeButton';
import { useItemOverrideById } from '~/context/ItemOverrideContext';

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
  const itemOverride = useItemOverrideById(id);
  const itemStats = itemOverride?.itemStats ?? item.itemStats;
  const dateDistance = useDateDistance(createdAt);
  const { like, unlike } = useLikeManager();

  const isLiked = itemOverride?.isLiked ?? item.isLiked;
  const likes = itemOverride?.itemStats.likes ?? itemStats.likes;
  /**@todo: 연타로 누르면 기존의 것이 잘 취소되어야함 */
  const toggleLike = () => {
    if (isLiked) {
      unlike(id, itemStats);
    } else {
      like(id, itemStats);
    }
  };
  return (
    <Block>
      {thumbnail ? <Thumbnail src={thumbnail} alt={title} /> : null}
      <Publisher>
        {favicon ? <img src={favicon} alt='favicon' /> : <Globe />}
        {author ? `${author} · ` : ''}
        {name}
      </Publisher>
      <h3>{item.title}</h3>
      <p>{body}</p>
      {likes === 0 ? null : <LikesCount>좋아요 {likes.toLocaleString()}개</LikesCount>}
      <Footer>
        <LikeButton onClick={toggleLike} isLiked={isLiked} />
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

const LikesCount = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.gray4};
  line-height: 1.5;
  margin-bottom: 8px;
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
