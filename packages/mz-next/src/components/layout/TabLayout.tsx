import React from "react";
import FullHeightPage from "@/components/system/FullHeightPage";
import MobileHeader from "@/components/base/MobileHeader";
import Footer from "@/components/base/Footer";
import styles from "@/styles/TabLayout.module.scss";
import DesktopHeader from "../base/DesktopHeader";
import classNames from "classnames";

interface Props {
  className?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
}

const TabLayout = ({ className, children, header }: Props) => {
  const divClass = classNames(styles.tabLayout, className);
  return (
    <FullHeightPage>
      {header ?? (
        <>
          <MobileHeader />
          <DesktopHeader />
        </>
      )}
      <div className={divClass}>{children}</div>
      <Footer />
    </FullHeightPage>
  );
};

export default TabLayout;
