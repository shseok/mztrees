import React from "react";
import styles from "@/styles/Object.module.scss";

interface Props {
  bottom: string;
  left: string;
  translateX: number;
  translateY: number;
}

const cubeSize = 60;

const Object = ({ bottom, left, translateX, translateY }: Props) => {
  return (
    <div
      className={styles.container}
      style={{
        bottom: `${bottom}`,
        left: `${left}`,
        transform: `translate(${translateX}px,${translateY}px)`,
      }}
    >
      <div
        className={styles.cube}
        style={{
          width: `${cubeSize}px`,
          height: `${cubeSize}px`,
        }}
      >
        <div
          className={styles.top}
          style={{
            background: `#222`,
            transform: `rotateX(90deg) translateZ(${cubeSize / 2}px)`,
          }}
        />
        <div
          className={styles.bottom}
          style={{
            background: `#00ec00`,
            transform: `rotateX(90deg) translateZ(${(-1 * cubeSize) / 2}px)`,
          }}
        />
        <div>
          <span
            style={{
              background: `linear-gradient(#151515, #00ec00)`,
              transform: `rotateY(calc(90deg* ${0})) translateZ(${
                cubeSize / 2
              }px)`,
            }}
          />
          <span
            style={{
              background: `linear-gradient(#151515, #00ec00)`,
              transform: `rotateY(calc(90deg* ${1})) translateZ(${
                cubeSize / 2
              }px)`,
            }}
          />
          <span
            style={{
              background: `linear-gradient(#151515, #00ec00)`,
              transform: `rotateY(calc(90deg* ${2})) translateZ(${
                cubeSize / 2
              }px)`,
            }}
          />
          <span
            style={{
              background: `linear-gradient(#151515, #00ec00)`,
              transform: `rotateY(calc(90deg* ${3})) translateZ(${
                cubeSize / 2
              }px)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Object;
