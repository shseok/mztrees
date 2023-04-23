import React from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as Feed } from '~/assets/feed.svg';
import { ReactComponent as Search } from '~/assets/search.svg';
import { ReactComponent as plusCircle } from '~/assets/plusCircle.svg';
import { ReactComponent as Bookmark } from '~/assets/bookmark.svg';
import { ReactComponent as Setting } from '~/assets/setting.svg';
import { colors } from '~/lib/colors';
import { Link } from 'react-router-dom';

const IconMap = {
  home: Feed,
  search: Search,
  'plus-circle': plusCircle,
  bookmark: Bookmark,
  setting: Setting,
} as const;

interface Props {
  icon: keyof typeof IconMap;
  isActive?: boolean;
  to?: string;
}

const FooterTabItem = ({ icon, isActive, to }: Props) => {
  const iconEl = React.createElement(IconMap[icon]);
  if (to) {
    return (
      <LinkItem $isActive={isActive} to={to}>
        {iconEl}
      </LinkItem>
    );
  }
  return <ButtonItem>{iconEl}</ButtonItem>;
};

const CommonStyle = (isActive?: boolean) => css`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 32px;
    height: 32px;
    color: ${colors.gray2};
    ${isActive &&
    css`
      color: ${colors.primary};
    `}
  }
`;

const LinkItem = styled(Link)<{ $isActive?: boolean }>`
  ${(props) => CommonStyle(props.$isActive)}
`;

const ButtonItem = styled.button`
  background: transparent;
  outline: none;
  border: none;

  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 32px;
    height: 32px;
    color: ${colors.gray2};
  }
`;

export default FooterTabItem;
