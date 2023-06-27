"use client";

import React, { useRef, useState } from "react";
import Button from "../system/Button";
import UserMenu from "./UserMenu";
import styles from "@/styles/UserAddon.module.scss";
import Link from "next/link";
import { User } from "@/utils/vectors";

interface Props {
  username: string;
  profileImage: string;
}

const UserAddon = ({ username }: Props) => {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const onOpen = () => {
    setVisible(true);
  };
  const onClose = (e?: Event) => {
    const buttonEl = buttonRef?.current;
    const isButton =
      buttonEl === e?.target || buttonEl?.contains(e?.target as Node);
    if (isButton) return;

    setVisible(false);
  };
  return (
    <div className={styles.responsive}>
      <Link href="/write" style={{ textDecoration: "none" }}>
        <Button className={styles.write_button} size="small" variant="primary">
          새 글 작성
        </Button>
      </Link>
      <Button size="small" variant="tertiary" onClick={onOpen} ref={buttonRef}>
        <span className={styles.block}>
          <User />
          {username}
        </span>
      </Button>
      <UserMenu visible={visible} onClose={onClose} />
    </div>
  );
};

export default UserAddon;
