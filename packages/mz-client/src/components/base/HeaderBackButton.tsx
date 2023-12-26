'use client';

import { useGoBack } from '@/hooks/useGoback';
import styles from '@/styles/HeaderBackButton.module.scss';
import { ArrowLeft } from '@/components/vectors';

const HeaderBackButton = () => {
  const goBack = useGoBack();
  return (
    <button className={styles.button} onClick={goBack} aria-label='뒤로 가기'>
      <ArrowLeft />
    </button>
  );
};
export default HeaderBackButton;
