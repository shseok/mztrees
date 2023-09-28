import React from "react";
import Object from "./Object";

const BackgroundContent = ({ x, y }: { x: number; y: number }) => {
  return (
    <>
      {/* light yellow */}
      <Object
        bottom={"38%"}
        left={"27%"}
        translateX={(x / 100) * 10}
        translateY={(y / 100) * 10}
      />
      <Object
        bottom={"50%"}
        left={"70%"}
        translateX={(x / 100) * -10}
        translateY={(y / 100) * 10}
      />
      <Object
        bottom={"12%"}
        left={"60%"}
        translateX={(x / 100) * -8}
        translateY={(y / 100) * -4}
      />
    </>
  );
};

export default BackgroundContent;
