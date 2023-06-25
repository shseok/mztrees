"use client";

import React from "react";
import FullHeightPage from "@/components/system/FullHeightPage";
import { useGoBack } from "@/hooks/useGoback";
import HeaderBackButton from "@/components/base/HeaderBackButton";
import MobileHeader from "@/components/base/MobileHeader";
import DesktopHeader from "../base/DesktopHeader";
import styles from "@/styles/BasicLayout.module.scss";

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
  onGoback,
  desktopHeaderVisible = true,
}: Props) => {
  const goBack = useGoBack();

  return (
    <FullHeightPage>
      <MobileHeader
        title={title}
        headerLeft={
          hasBackButton ? (
            <HeaderBackButton onClick={onGoback ?? goBack} />
          ) : undefined
        }
        headerRight={headerRight}
      />
      {desktopHeaderVisible && <DesktopHeader />}
      <div className={styles.content}>{children}</div>
    </FullHeightPage>
  );
};

export default BasicLayout;
