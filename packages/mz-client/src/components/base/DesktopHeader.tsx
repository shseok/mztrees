'use client';

import styles from '@/styles/DesktopHeader.module.scss';
import Button from '../system/Button';
import SearchArea from './SearchArea';
import UserAddon from './UserAddon';
import { Logo } from '@/components/vectors';
import { useUser } from '@/context/UserContext';

const DesktopHeader = () => {
  const { currentUser } = useUser();

  return (
    <header className={styles.block}>
      <div className={styles.block_top}>
        <div className={styles.content}>
          {/* tag 도입 후 params이 남아있기 때문에 Link -> a */}
          <a
            className={styles.home_link}
            href='/'
            aria-label='데스크탑 헤더에서 홈으로 이동'
          >
            <Logo className={styles.styled_logo} />
          </a>
          <div className={styles.addon} />
          <div className={styles.addon}>
            <SearchArea />
            {currentUser ? (
              <UserAddon username={currentUser.username} profileImage={''} />
            ) : (
              <div className={styles.buttons}>
                <Button
                  type='button'
                  aria-label='데스크탑 헤더에서 로그인 페이지로 이동'
                  variant='tertiary'
                  size='small'
                  to='/login'
                >
                  로그인
                </Button>
                <Button
                  type='button'
                  aria-label='데스크탑 헤더에서 회원가입 페이지로 이동'
                  size='small'
                  to='/register'
                >
                  회원가입
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
