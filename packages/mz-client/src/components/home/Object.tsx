import React from "react";
import styles from "@/styles/Object.module.scss";

interface Props {
  src: string;
  translateX: number;
  translateY: number;
}

const Object = ({ src, translateX, translateY }: Props) => {
  return (
    <div
      className={styles.box}
      style={{
        backgroundImage: `url(${src})`,
        transform: `translate(${translateX}px,${translateY}px)`,
      }}
    />
  );
};

export default Object;
