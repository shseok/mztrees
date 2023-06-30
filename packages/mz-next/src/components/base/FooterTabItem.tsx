"use client";

import { Home, Search, PlusCircle, Bookmark, Setting } from "@/utils/vectors";
import styles from "@/styles/FooterTabItem.module.scss";
import classNames from "classnames/bind";
import Link from "next/link";
import { usePathname } from "next/navigation";

const cx = classNames.bind(styles);

const IconMap = {
  home: <Home />,
  search: <Search />,
  "plus-circle": <PlusCircle />,
  bookmark: <Bookmark />,
  setting: <Setting />,
} as const;

interface Props {
  icon: keyof typeof IconMap;
  to: string;
}

const FooterTabItem = ({ icon, to }: Props) => {
  const pathname = usePathname();
  // console.log(pathname, to);
  return (
    <Link
      className={cx("like_item", pathname === to && "active")}
      href={to}
      // passHref
    >
      {IconMap[icon]}
    </Link>
  );
};

export default FooterTabItem;
