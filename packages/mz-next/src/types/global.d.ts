// declare module "*.svg" {
//   const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
//   export default content;
// }

declare module "*.svg" {
  import React from "react";
  const svg: React.FC<React.SVGProps<SVGSVGElement>>;
  export default svg;
}
