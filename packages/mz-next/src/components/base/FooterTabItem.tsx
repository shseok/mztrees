import React from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as Feed } from '~/assets/feed.svg';
import { ReactComponent as Search } from '~/assets/search.svg';
import { ReactComponent as plusCircle } from '~/assets/plusCircle.svg';
import { ReactComponent as Bookmark } from '~/assets/bookmark.svg';
import { ReactComponent as Setting } from '~/assets/setting.svg';
import { colors } from '~/lib/colors';
import { NavLink } from 'react-router-dom';

const IconMap = {
  home: Feed,
  search: Search,
  'plus-circle': plusCircle,
  bookmark: Bookmark,
  setting: Setting,
} as const;

interface Props {
  icon: keyof typeof IconMap;
  to: string;
}

const FooterTabItem = ({ icon, to }: Props) => {
  const iconEl = React.createElement(IconMap[icon]);
  return (
    <LinkItem
      to={to}
      className={({ isActive, isPending }) => (isPending ? 'pending' : isActive ? 'active' : '')}
    >
      {iconEl}
    </LinkItem>
  );
};

const CommonStyle = css`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 32px;
    height: 32px;
    color: ${colors.gray2};
  }
  &.active {
    svg {
      color: ${colors.primary};
    }
  }
`;

const LinkItem = styled(NavLink)`
  ${CommonStyle}
`;

export default FooterTabItem;
