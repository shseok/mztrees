import React, { useMemo } from 'react';
import styled from 'styled-components';
import { colors } from '~/lib/colors';
import FooterTabItem from '~/components/base/FooterTabItem';
import { useLocation } from 'react-router-dom';

const paths = ['search', 'bookmarks', 'setting'] as const;

const isValidPath = (path): path is (typeof paths)[number] => paths.includes(path);

const Footer = () => {
  const location = useLocation();
  const currentPage = useMemo(() => {
    const path = location.pathname.split('/')[1];
    if (isValidPath(path)) {
      return path;
    }
    return 'home';
  }, [location.pathname]);
  console.log(currentPage);
  return (
    <StyledFooter>
      <FooterTabItem icon={'home'} isActive={currentPage === 'home'} to='/' />
      <FooterTabItem icon={'search'} isActive={currentPage === 'search'} to='/search' />
      <FooterTabItem icon={'plus-circle'} />
      <FooterTabItem icon={'bookmark'} isActive={currentPage === 'bookmarks'} to='/bookmarks' />
      <FooterTabItem icon={'setting'} isActive={currentPage === 'setting'} to='/setting' />
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  height: 56px;
  border-top: 1px solid ${colors.gray0};
  display: flex;
`;

export default Footer;
