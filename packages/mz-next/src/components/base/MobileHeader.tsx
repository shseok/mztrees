import React from "react";
import logo from "../../../public/assets/logo.svg";
import Image from "next/image";
import styles from "@/styles/MobileHeader.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
export interface HeaderProps {
  title?: React.ReactNode;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}

const MobileHeader = ({
  title = <Image src={logo} alt="logo" width={84} height={17} />,
  headerLeft,
  headerRight,
  className,
}: HeaderProps) => {
  return (
    <header className={cx("block", className)}>
      {headerLeft && (
        <div className={cx("header_side", "left")}>{headerLeft}</div>
      )}
      <div className={styles.title}>{title}</div>
      {headerRight && (
        <div className={cx("header_side", "right")}>{headerRight}</div>
      )}
    </header>
  );
};

export default MobileHeader;
