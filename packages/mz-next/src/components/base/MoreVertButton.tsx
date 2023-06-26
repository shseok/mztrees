import React from "react";
import Image from "next/image";
import morevert from "../../../public/assets/more-vert.svg";
import styles from "@/styles/MoreVertButton.module.scss";
interface Props {
  onClick: () => void;
}

const MoreVertButton = ({ onClick }: Props) => {
  return (
    <button className={styles.styled_button} onClick={onClick}>
      <Image src={morevert} alt="more-vert" />
    </button>
  );
};

export default MoreVertButton;
