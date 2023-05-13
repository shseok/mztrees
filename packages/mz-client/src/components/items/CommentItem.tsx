import styled from 'styled-components';
import { useDateDistance } from '~/hooks/useDateDistance';
import { Comment } from '~/lib/api/types';
import { colors } from '~/lib/colors';
import SubCommentList from './SubCommentList';

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
  } = comment;
  console.log(subcomments);
  const distance = useDateDistance(createdAt);
  return (
    <Block>
      <CommentHead>
        <UserName>{username}</UserName>
        <Time>{distance}</Time>
      </CommentHead>
      <Text>{text}</Text>
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
  margin-bottom: 8px;
  color: ${colors.gray5};
  line-height: 1.5;
  white-space: pre-wrap;
  font-size: 14px;
  word-break: keep-all;
`;
export default CommentItem;
