import React from 'react';
import styled from 'styled-components';
import { SearchItemResult } from '~/lib/api/types';
import { ReactComponent as Globe } from '~/assets/globe.svg';
import { colors } from '~/lib/colors';

interface Props {
  item: SearchItemResult;
}

const SearchResultCard = ({ item }: Props) => {
  const {
    publisher: { favicon, name },
    author,
    likes,
    hightlight: { title, body },
  } = item;

  return (
    <Block>
      <Publisher>
        {favicon ? <img src={favicon} alt='favicon' /> : <Globe />}
        {author ? `${author} · ` : ''}
        {name}
      </Publisher>
      {/* TODO: Secure this code */}
      <Title dangerouslySetInnerHTML={{ __html: title }} />
      <Body dangerouslySetInnerHTML={{ __html: body }} />
      <LikesCount>좋아요 {likes.toLocaleString()}개</LikesCount>
    </Block>
  );
};

const Block = styled.div`
  display: flex;
  flex-direction: column;

  em {
    color: ${colors.primary};
    font-style: normal;
  }
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
  margin-bottom: 0px;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: ${colors.gray4};

  em {
    font-weight: 800;
  }
`;

const Body = styled.p`
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  line-height: 1.5;
  color: ${colors.gray4};

  em {
    font-weight: 600;
  }
`;

const LikesCount = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: ${colors.gray4};
  line-height: 1.5;
  height: 26px;
  display: flex;
  align-items: top;
`;

export default SearchResultCard;
