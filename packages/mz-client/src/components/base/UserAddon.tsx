import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as User } from '~/assets/user.svg';
import Button from '../system/Button';
import UserMenu from './UserMenu';

interface Props {
  username: string;
  profileImage: string;
}

const UserAddon = ({ username }: Props) => {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const onOpen = () => {
    setVisible(true);
  };
  const onClose = (e?: Event) => {
    const buttonEl = buttonRef?.current;
    const isButton = buttonEl === e?.target || buttonEl?.contains(e?.target as Node);
    if (isButton) return;

    setVisible(false);
  };
  return (
    <Responsive>
      <Button size='small' variant='tertiary' onClick={onOpen} ref={buttonRef}>
        <Block>
          <User />
          {username}
        </Block>
      </Button>
      <UserMenu visible={visible} onClose={onClose} />
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
export default UserAddon;
