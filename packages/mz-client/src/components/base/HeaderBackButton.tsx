'use client';

import { useGoBack } from '@/hooks/useGoback';
import styles from '@/styles/HeaderBackButton.module.scss';
import { ArrowLeft } from '@/components/vectors';

const HeaderBackButton = () => {
  const goBack = useGoBack();
  return (
    <button className={styles.button} onClick={goBack}>
      <ArrowLeft />
    </button>
  );
};
export default HeaderBackButton;
