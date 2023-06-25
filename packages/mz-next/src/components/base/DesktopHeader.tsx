import React from "react";
import logo from "../../../public/assets/logo.svg";
import Image from "next/image";
import styles from "@/styles/DesktopHeader.module.scss";
import Button from "../system/Button";
import SearchArea from "./SearchArea";
import UserAddon from "./UserAddon";
import { useUser } from "@/hooks/stores/userStore";
import Link from "next/link";

const DesktopHeader = () => {
  const currentUser = useUser();

  return (
    <header className={styles.block}>
      <Link href="/">
        <Image src={logo} alt="logo" className={styles.logo_container} />
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
