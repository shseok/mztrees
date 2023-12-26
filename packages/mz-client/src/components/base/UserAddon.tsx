'use client';

import React, { useRef, useState } from 'react';
import Button from '../system/Button';
import UserMenu from './UserMenu';
import styles from '@/styles/UserAddon.module.scss';
import { User } from '@/components/vectors';

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
    const isButton =
      buttonEl === e?.target || buttonEl?.contains(e?.target as Node);
    if (isButton) return;

    setVisible(false);
  };
  return (
    <div className={styles.responsive}>
      <Button
        className='write_button'
        to='/write'
        size='small'
        variant='primary'
        aria-label='새로운 글 작성'
      >
        새 글 작성
      </Button>
      <Button
        size='small'
        variant='tertiary'
        onClick={onOpen}
        ref={buttonRef}
        aria-label='유저 메뉴 열기'
      >
        <span className={styles.block}>
          <User />
          {username}
        </span>
      </Button>
      <UserMenu visible={visible} onClose={onClose} />
    </div>
  );
};

export default UserAddon;
