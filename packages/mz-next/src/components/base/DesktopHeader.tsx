"use client";

import React, { use } from "react";
import styles from "@/styles/DesktopHeader.module.scss";
import Button from "../system/Button";
import SearchArea from "./SearchArea";
import UserAddon from "./UserAddon";
// import { useUser } from "@/hooks/stores/userStore";
import Link from "next/link";
import { Logo } from "@/utils/vectors";
import { useUser } from "@/context/userContext";

const DesktopHeader = () => {
  // const currentUser = useUser();
  const currentUser = useUser();
  console.log("DesktopHeader", currentUser);

  return (
    <header className={styles.block}>
      <Link className={styles.home_link} href="/">
        <Logo className={styles.styled_logo} />
      </Link>
      <div className={styles.content}>
        <div className={styles.addon}></div>
        <div className={styles.addon}>
          <SearchArea />
          {currentUser ? (
            <UserAddon username={currentUser.username} profileImage={""} />
          ) : (
            <div className={styles.buttons}>
              <Button variant="tertiary" size="small" to="/login">
                로그인
              </Button>
              <Button size="small" to="/register">
                회원가입
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
