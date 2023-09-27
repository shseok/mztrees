import React from "react";
import Object from "./Object";

const BackgroundContent = ({ x, y }: { x: number; y: number }) => {
  return (
    <>
      {/* light yellow */}
      <Object
        locationX={"29%"}
        locationY={"7%"}
        translateX={(x / 100) * 10}
        translateY={(y / 100) * 10}
        bgColor={"rgb(255,255,102)"}
      />
      {/* light cyan */}
      <Object
        locationX={"68%"}
        locationY={"37%"}
        translateX={(x / 100) * -10}
        translateY={(y / 100) * 10}
        bgColor={"rgb(177,255,255)"}
      />
      {/* light green */}
      <Object
        locationX={"39%"}
        locationY={"70%"}
        translateX={(x / 100) * -8}
        translateY={(y / 100) * -4}
        bgColor={"rgb(144,238,144)"}
      />
    </>
  );
};

export default BackgroundContent;
