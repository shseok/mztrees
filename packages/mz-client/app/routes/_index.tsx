import type { V2_MetaFunction } from "@remix-run/react";
import Header from "~/components/Header";

export const meta: V2_MetaFunction = () => {
  return [{ title: "New Remix App" }];
};

export default function Index() {
  return (
    <>
      <Header />
    </>
  );
}
