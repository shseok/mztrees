import React, { useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { ReactComponent as User } from '~/assets/user.svg';
import Button from '../system/Button';
import { usePopper } from 'react-popper';
import { mediaQuery } from '~/lib/media';
import { colors } from '~/lib/colors';
import { Link } from 'react-router-dom';
interface Props {
  username: string;
  profileImage: string;
}

const UserAddon = ({ username }: Props) => {
  const [showPopper, setShowPopper] = useState(false);
  const buttonRef = useRef(null);
  const popperRef = useRef(null);

  const [arrowRef, setArrowRef] = useState<HTMLDivElement | null>(null);

  const { styles, attributes } = usePopper(buttonRef.current, popperRef.current, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'arrow',
        options: {
          element: arrowRef,
        },
      },
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
    ],
  });

  return (
    <Responsive>
      <Button
        size='small'
        variant='tertiary'
        ref={buttonRef}
        onClick={() => setShowPopper(!showPopper)}
      >
        <Block>
          <User />
          {username}
        </Block>
      </Button>
      {showPopper ? (
        <PopperContainer ref={popperRef} style={styles.popper} {...attributes.popper}>
          <div ref={setArrowRef} style={styles.arrow} id='arrow' />
          <MenuItem mobilehidden={true} to='/write'>
            새 글 등록
          </MenuItem>
          <MenuItem to='/setting'>내 계정</MenuItem>
          <MenuItem to='/bookmarks'>북마크</MenuItem>
          <MenuItem to='/login'>로그아웃</MenuItem>
        </PopperContainer>
      ) : null}
    </Responsive>
  );
};

const Responsive = styled.div`
  position: relative;
  display: flex;
`;

const Block = styled.span`
  display: flex;
  align-items: center;
  svg {
    display: block;
    margin-right: 8px;
    width: 20px;
    height: 20px;
  }
`;

const PopperContainer = styled.div`
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  background-color: white;
  padding: 20px;
  text-align: center;
  width: 140px;

  #arrow {
    position: absolute;
    width: 10px;
    height: 10px;
    &:after {
      position: absolute;
      content: '';
      background-color: white;
      box-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
      top: -25px; // padding + popper height
      left: 20px;
      transform: rotate(45deg);
      width: 10px;
      height: 10px;
    }
  }

  &[data-popper-placement^='top'] > #arrow {
    bottom: -30px;
    :after {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
    }
  }
`;

const MenuItem = styled(Link)<{ mobilehidden?: boolean }>`
  display: block;
  text-decoration: none;

  ${(props) =>
    props.mobilehidden &&
    css`
      display: none;
      ${mediaQuery(700)} {
        display: block;
      }
    `}
  color: ${colors.gray5};
  padding: 16px;
  cursor: pointer;

  &:hover {
    transition: all 0.125s ease-in;
    background: ${colors.gray0};
  }
`;

export default UserAddon;
