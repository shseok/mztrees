import React from "react";
import Object from "./Object";

const BackgroundContent = ({ x, y }: { x: number; y: number }) => {
  return (
    <>
      <Object src="/assets/2.png" translateX={x / 100} translateY={y / 100} />
      <Object
        src="/assets/3.png"
        translateX={(x / 100) * -2}
        translateY={(y / 100) * -2}
      />
      <Object
        src="/assets/4.png"
        translateX={(x / 100) * -4}
        translateY={(y / 100) * -4}
      />
      <Object
        src="/assets/5.png"
        translateX={(x / 100) * -6}
        translateY={(y / 100) * -6}
      />
      <Object
        src="/assets/6.png"
        translateX={(x / 100) * -8}
        translateY={(y / 100) * -8}
      />
      <Object
        src="/assets/7.png"
        translateX={(x / 100) * -10}
        translateY={(y / 100) * -10}
      />
    </>
  );
};

export default BackgroundContent;
