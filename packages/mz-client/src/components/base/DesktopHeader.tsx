"use client";

import styles from "@/styles/DesktopHeader.module.scss";
import Button from "../system/Button";
import SearchArea from "./SearchArea";
import UserAddon from "./UserAddon";
import Link from "next/link";
import { Logo } from "@/components/vectors";
import { useUser } from "@/context/UserContext";
import ThemeToggleButton from "../system/ThemeToggleButton";

const DesktopHeader = () => {
  const { currentUser } = useUser();

  return (
    <header className={styles.block}>
      <Link className={styles.home_link} href="/">
        <Logo className={styles.styled_logo} />
      </Link>
      <div className={styles.content}>
        <div className={styles.addon}></div>
        <div className={styles.addon}>
          <ThemeToggleButton />
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
