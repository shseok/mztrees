import React from "react";
import styles from "@/styles/Object.module.scss";

interface Props {
  locationX: string;
  locationY: string;
  translateX: number;
  translateY: number;
  bgColor: string;
}

const Object = ({
  locationX,
  locationY,
  translateX,
  translateY,
  bgColor,
}: Props) => {
  return (
    <div
      className={styles.box}
      style={{
        // backgroundImage: `url(${src})`,
        // filter: "blur(10px)",
        top: `${locationX}`,
        left: `${locationY}`,
        background: `${bgColor}`,
        transform: `translate(${translateX}px,${translateY}px)`,
      }}
    />
  );
};

export default Object;
