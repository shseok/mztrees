import React from "react";
import Image from "next/image";
import spinner from "../../../public/assets/spinner.svg";
import styles from "@/styles/LoadingIndicator.module.scss";

const LoadingIndicator = () => {
  return (
    <Image className={styles.styled_spinner} src={spinner} alt="Loading..." />
  );
};
export default LoadingIndicator;
