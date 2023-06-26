import React from "react";
import { Item } from "@/lib/api/types";
import LinkCard from "./LinkCard";
import styles from "@/styles/LinkCardList.module.scss";

interface Props {
  items: Item[];
}

const LinkCardList = ({ items }: Props) => {
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <LinkCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default LinkCardList;
