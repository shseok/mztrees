import styled from 'styled-components';
import { Item } from '~/lib/api/types';
import { colors } from '~/lib/colors';
import { ReactComponent as Globe } from '~/assets/globe.svg';
import { useDateDistance } from '~/hooks/useDateDistance';
import { useLikeManager } from '~/hooks/useLikeManager';
import LikeButton from '../system/LikeButton';
import { useItemOverrideById } from '~/hooks/stores/ItemOverrideStore';
import { motion, AnimatePresence } from 'framer-motion';
import { getMyAccount } from '~/lib/api/me';
import { useOpenLoginDialog } from '~/hooks/useOpenLoginDialog';
import { Link } from 'react-router-dom';
import BookmarkButton from '../system/BookmarkButton';
import { useBookmarkManager } from '~/hooks/useBookmarkManager';
import { media } from '~/lib/media';
import { setUser } from '~/hooks/stores/userStore';

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
  const { bookmark, unbookmark } = useBookmarkManager();

  // const isMultiColumn = useIsMultiColumn();
  // console.log(isMultiColumn);

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

  const link = `/items/${item.id}`;

  return (
    <Block>
      <StyledLink to={link}>
        {thumbnail ? <Thumbnail src={thumbnail} alt={title} /> : null}
        <Publisher>
          {favicon ? <img src={favicon} alt='favicon' /> : <Globe />}
          {author ? `${author} · ` : ''}
          {name}
        </Publisher>
        <Title>{item.title}</Title>
        <Body>{body}</Body>
      </StyledLink>
      <LikeCountWrapper>
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
      </LikeCountWrapper>
      <Footer>
        <IconContainer>
          <LikeButton onClick={toggleLike} isLiked={isLiked} />
          <BookmarkButton onClick={toggleBookmark} isBookmarked={isBookmarked} />
        </IconContainer>
        <UserInfo>
          by <b>{username}</b> · {dateDistance}
        </UserInfo>
      </Footer>
    </Block>
  );
};

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  text-decoration: none;
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

const Thumbnail = styled.img`
  display: block;
  width: 100%;
  max-height: 40vh;
  ${media.tablet} {
    aspect-ratio: 1200/630;
  }
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

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  color: ${colors.gray5};

  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 27px;
`;
const Body = styled.p`
  line-height: 1.5;
  font-size: 14px;
  margin-top: 0;
  margin-bottom: 16px;
  color: ${colors.gray4};

  ${media.tablet} {
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 84px;
  }
`;

const LikeCountWrapper = styled.div`
  ${media.tablet} {
    height: 26px;
  }
`;
// 12*1.5+8(height: font-size*line-height+padding-bottom)
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

export default LinkCard;
