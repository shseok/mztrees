import React from 'react';
import FullHeightPage from '@/components/system/FullHeightPage';
import HeaderBackButton from '@/components/base/HeaderBackButton';
import MobileHeader from '@/components/base/MobileHeader';
import DesktopHeader from '../base/DesktopHeader';
import styles from '@/styles/BasicLayout.module.scss';

interface Props {
  hasBackButton: boolean;
  headerRight?: React.ReactNode;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onGoback?(): void;
  desktopHeaderVisible?: boolean;
}

const BasicLayout = ({
  hasBackButton,
  headerRight,
  title,
  children,
  desktopHeaderVisible = true,
}: Props) => {
  return (
    <FullHeightPage>
      <MobileHeader
        title={title}
        headerLeft={hasBackButton ? <HeaderBackButton /> : undefined}
        headerRight={headerRight}
      />
      {desktopHeaderVisible && <DesktopHeader />}
      <div className={styles.content}>{children}</div>
    </FullHeightPage>
  );
};

export default BasicLayout;
