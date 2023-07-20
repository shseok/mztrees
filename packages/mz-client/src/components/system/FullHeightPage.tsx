import React from "react";
import styles from "@/styles/FullHeightPage.module.scss";
// fullheight 트리거용(로그인 / 회원가입...)

interface Props {
  children: React.ReactNode;
}

const FullHeightPage = ({ children }: Props) => {
  return <div className={styles.page}>{children}</div>;
};

export default FullHeightPage;
