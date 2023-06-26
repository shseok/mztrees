import React from "react";
import Image from "next/image";
import feed from "../../../public/assets/feed.svg";
import search from "../../../public/assets/search.svg";
import plusCircle from "../../../public/assets/plusCircle.svg";
import bookmark from "../../../public/assets/bookmark.svg";
import setting from "../../../public/assets/setting.svg";
import styles from "@/styles/FooterTabItem.module.scss";
import classNames from "classnames/bind";
import Link from "next/link";
import { useRouter } from "next/router";

const cx = classNames.bind(styles);

const IconMap = {
  home: <Image src={feed} alt="feed" />,
  search: <Image src={search} alt="search" />,
  "plus-circle": <Image src={plusCircle} alt="plusCircle" />,
  bookmark: <Image src={bookmark} alt="bookmark" />,
  setting: <Image src={setting} alt="setting" />,
} as const;

interface Props {
  icon: keyof typeof IconMap;
  to: string;
}

const FooterTabItem = ({ icon, to }: Props) => {
  const router = useRouter();
  return (
    <Link href={to} passHref>
      <a className={cx("like_item", router.pathname === to && "active")}></a>
      {IconMap[icon]}
    </Link>
  );
};

export default FooterTabItem;
