"use client";

import styles from "@/styles/DesktopHeader.module.scss";
import Button from "../system/Button";
import SearchArea from "./SearchArea";
import UserAddon from "./UserAddon";
import Link from "next/link";
import { Logo } from "@/components/vectors";
import { useUser } from "@/context/UserContext";
import ThemeToggleButton from "../system/ThemeToggleButton";
import RegionCategorySelector from "../home/RegionCategorySelector";

const DesktopHeader = () => {
  const { currentUser } = useUser();

  return (
    <header className={styles.block}>
      <div className={styles.block_top}>
        <div className={styles.content}>
          <Link className={styles.home_link} href="/">
            <Logo className={styles.styled_logo} />
          </Link>
          <div className={styles.addon} />
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
      </div>
      <div className={styles.block_bottom}>
        <div className={styles.content}>
          <RegionCategorySelector />
        </div>
      </div>
    </header>
  );
};

export default DesktopHeader;
