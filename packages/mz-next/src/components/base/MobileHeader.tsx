import React from "react";
import logioIcon from "../../../public/assets/logo.svg";
import Image from "next/image";
import styles from "@/styles/MobileHeader.module.scss";
import classNames from "classnames";

export interface HeaderProps {
  title?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}

const MobileHeader = ({
  title = <Image src={logioIcon} alt="logo" />,
  headerLeft,
  headerRight,
  className,
}: HeaderProps) => {
  return (
    <header className={styles.block}>
      {headerLeft && (
        <div className={classNames(styles.header_side, "left")}>
          {headerLeft}
        </div>
      )}
      <div className={styles.title}>{title}</div>
      {headerRight && (
        <div className={classNames(styles.header_side, "right")}>
          {headerRight}
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
