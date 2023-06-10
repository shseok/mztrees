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
import { useItemOverrideById } from '~/hooks/stores/ItemOverrideStore';
import { useDateDistance } from '~/hooks/useDateDistance';
import { Link } from 'react-router-dom';
import BookmarkButton from '../system/BookmarkButton';
import { useBookmarkManager } from '~/hooks/useBookmarkManager';
import { setUser } from '~/hooks/stores/userStore';

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
  const { bookmark, unbookmark } = useBookmarkManager();

  const isLiked = itemOverride?.isLiked ?? item.isLiked;
  const likes = itemOverride?.itemStats?.likes ?? itemStats.likes;
  const isBookmarked = itemOverride?.isBookmarked ?? item.isBookmarked;
  /**TODO: 연타로 누르면 기존의 것이 잘 취소되어야함 */
  const openLoginDialog = useOpenLoginDialog();
  const set = setUser();
  /**TODO: move to hooks */
  const toggleLike = async () => {
    const currentUser = await getMyAccount();
    set(currentUser);
    if (!currentUser) {
      openLoginDialog('itemLike');
      return;
    }
    if (isLiked) {
      unlike(id, itemStats);
    } else {
      like(id, itemStats);
    }
  };

  const toggleBookmark = async () => {
    const currentUser = await getMyAccount();
    set(currentUser);
    if (!currentUser) {
      openLoginDialog('itemBookmark');
      return;
    }
    if (isBookmarked) {
      unbookmark(id);
    } else {
      bookmark(id);
    }
  };
  return (
    <Block>
      {thumbnail ? (
        <Link to={item.link}>
          <Thumbnail src={thumbnail} />
        </Link>
      ) : null}
      <Content>
        <Link to={item.link}>
          <Publisher>
            {favicon ? <img src={favicon} alt='favicon' /> : <Globe />}
            {author ? `${author} · ` : ''}
            {name}
          </Publisher>
          <Title>{title}</Title>
          <Body>{body}</Body>
        </Link>
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
          <IconContainer>
            <LikeButton onClick={toggleLike} isLiked={isLiked} />
            <BookmarkButton onClick={toggleBookmark} isBookmarked={isBookmarked} />
          </IconContainer>
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
  a {
    display: block;
    text-decoration: none;
    color: inherit;
  }
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  a {
    display: block;
  }
`;
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
  margin-top: 0px;
  margin-bottom: 0px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default ItemViewer;
