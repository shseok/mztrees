"use client";

import {
  Home,
  Search,
  PlusCircle,
  Bookmark,
  Setting,
} from "@/components/vectors";
import styles from "@/styles/FooterTabItem.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/common";

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
      className={cn(styles.like_item, pathname === to && styles.active)}
      href={to}
      // passHref
    >
      {IconMap[icon]}
    </Link>
  );
};

export default FooterTabItem;
