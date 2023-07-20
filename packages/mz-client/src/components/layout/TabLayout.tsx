import React from "react";
import FullHeightPage from "@/components/system/FullHeightPage";
import MobileHeader from "@/components/base/MobileHeader";
import Footer from "@/components/base/Footer";
import styles from "@/styles/TabLayout.module.scss";
import DesktopHeader from "../base/DesktopHeader";
import { cn } from "@/utils/common";

interface Props {
  className?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
}

const TabLayout = ({ className, children, header }: Props) => {
  return (
    <FullHeightPage>
      {header ?? (
        <>
          <MobileHeader />
          <DesktopHeader />
        </>
      )}
      <div className={cn(styles.content, className && styles[className])}>
        {children}
      </div>
      <Footer />
    </FullHeightPage>
  );
};

export default TabLayout;
