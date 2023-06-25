import React from "react";
import arrowLeft from "../../../public/assets/arrow-left.svg";
import Image from "next/image";
import styles from "@/styles/HeaderBackButton.module.scss";

interface Props {
  onClick: () => void;
}

const HeaderBackButton = ({ onClick }: Props) => {
  return (
    <button className={styles.button} onClick={onClick}>
      <Image src={arrowLeft} alt="arrow-left" />
    </button>
  );
};
export default HeaderBackButton;
