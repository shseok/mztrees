'use client';

import { useGoBack } from '@/hooks/useGoback';
import styles from '@/styles/HeaderBackButton.module.scss';
import { ArrowLeft } from '@/components/vectors';

const HeaderBackButton = () => {
  const goBack = useGoBack();
  return (
    <button
      type='button'
      aria-label='뒤로 가기'
      className={styles.button}
      onClick={goBack}
    >
      <ArrowLeft />
    </button>
  );
};
export default HeaderBackButton;
