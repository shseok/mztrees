import styled from 'styled-components';
import { useDateDistance } from '~/hooks/useDateDistance';
import { Comment } from '~/lib/api/types';
import { colors } from '~/lib/colors';
import SubCommentList from './SubcommentList';
import LikeButton from '../system/LikeButton';

/**@todo isSubcomment 굳이 필요한가에 대한 고민 */
interface Props {
  comment: Comment;
  isSubcomment?: boolean;
}

const CommentItem = ({ comment, isSubcomment }: Props) => {
  const {
    user: { username },
    text,
    createdAt,
    subcomments,
    likesCount,
    mentionUser,
  } = comment;
  console.log(subcomments);
  const distance = useDateDistance(createdAt);
  return (
    <Block>
      <CommentHead>
        <UserName>{username}</UserName>
        <Time>{distance}</Time>
      </CommentHead>
      <Text>
        {mentionUser && <Mention>@{mentionUser.username}</Mention>}
        {text}
      </Text>
      <CommentFooter>
        <LikeBlock>
          <LikeButton size='small' isLiked onClick={() => {}} />
          <LikeCount>{likesCount === 0 ? '' : likesCount.toLocaleString()}</LikeCount>
        </LikeBlock>
        <ReplyButton>답글 달기</ReplyButton>
      </CommentFooter>
      {!isSubcomment && subcomments && <SubCommentList comments={subcomments} />}
    </Block>
  );
};

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentHead = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: ${colors.gray5};
`;
const Time = styled.div`
  margin-left: 4px;
  font-size: 16px;
  line-height: 1.5;
  color: ${colors.gray2};
`;

const Text = styled.p`
  margin-top: 4px;
  margin-bottom: 10px;
  color: ${colors.gray5};
  line-height: 1.5;
  white-space: pre-wrap;
  font-size: 14px;
  word-break: keep-all;
`;

const CommentFooter = styled.div`
  font-size: 12px;
  display: flex;
  color: ${colors.gray3};
  line-height: 1.5;
`;

const LikeBlock = styled.div`
  display: flex;
  align-items: center;
`;

const LikeCount = styled.span`
  margin-left: 4px;
  min-width: 24px;
`;

const ReplyButton = styled.button`
  background: none;
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  color: ${colors.gray3};
  line-height: 1.5;
`;

const Mention = styled.span`
  color: ${colors.primary};
  margin-right: 4px;
`;
export default CommentItem;
