import React from 'react';
import styled from 'styled-components';
import { Item } from '~/lib/api/types';
import { colors } from '~/lib/colors';
import { ReactComponent as Globe } from '~/assets/globe.svg';
import { AnimatePresence, motion } from 'framer-motion';
import LikeButton from '../system/LikeButton';
import { useLikeManager } from '~/hooks/useLikeManager';
import { useOpenLoginDialog } from '~/hooks/useOpenLoginDialog';
import { getMyAccount } from '~/lib/api/auth';
import { useItemOverrideById } from '~/hooks/store/ItemOverrideStore';
import { useDateDistance } from '~/hooks/useDateDistance';

interface Props {
  item: Item;
}

const ItemViewer = ({ item }: Props) => {
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
  const openLoginDialog = useOpenLoginDialog();
  /**@todo: move to hooks */
  const toggleLike = async () => {
    const currentUser = await getMyAccount();
    if (!currentUser) {
      openLoginDialog('like');
      return;
    }
    if (isLiked) {
      unlike(id, itemStats);
    } else {
      like(id, itemStats);
    }
  };
  return (
    <Block>
      {thumbnail ? <Thumbnail src={thumbnail} /> : null}
      <Content>
        <Publisher>
          {favicon ? <img src={favicon} alt='favicon' /> : <Globe />}
          {author ? `${author} · ` : ''}
          {name}
        </Publisher>
        <Title>{title}</Title>
        <Body>{body}</Body>
        <AnimatePresence initial={false}>
          {likes === 0 ? null : (
            <LikesCount
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 26, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              좋아요 {likes.toLocaleString()}개
            </LikesCount>
          )}
        </AnimatePresence>
        <Footer>
          <LikeButton onClick={toggleLike} isLiked={isLiked} />
          <UserInfo>
            by <b>{username}</b> · {dateDistance}
          </UserInfo>
        </Footer>
      </Content>
    </Block>
  );
};

const Content = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${colors.gray0};
`;

const Block = styled.div``;
const Thumbnail = styled.img`
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 0px;
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

const Title = styled.h2`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  color: ${colors.gray5};
`;

const Body = styled.p`
  line-height: 1.5;
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 32px;
  color: ${colors.gray4};
  white-space: pre-wrap;
  word-break: keep-all;
`;

const LikesCount = styled(motion.div)`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.gray4};
  line-height: 1.5;
  height: 26px;
  display: flex;
  align-items: top;
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

export default ItemViewer;
