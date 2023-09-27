"use client";

import React, { useEffect, useRef, useState } from "react";
import FullHeightPage from "@/components/system/FullHeightPage";
import MobileHeader from "@/components/base/MobileHeader";
import Footer from "@/components/base/Footer";
import styles from "@/styles/TabLayout.module.scss";
import DesktopHeader from "../base/DesktopHeader";
import { cn } from "@/utils/common";
import { useTabScrollTop } from "@/context/TabScrollTopContext";
import ThemeToggleButton from "../system/ThemeToggleButton";
import BackgroundContent from "../home/BackgroundContent";

interface Props {
  className?: string;
  children?: React.ReactNode;
  header?: React.ReactNode;
}

const TabLayout = ({ className, children, header }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  useTabScrollTop(ref);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <FullHeightPage>
      {header ?? (
        <>
          <MobileHeader />
          <DesktopHeader />
        </>
      )}
      <BackgroundContent x={mousePosition.x} y={mousePosition.y} />
      <div
        className={cn(styles.content, className && styles[className])}
        ref={ref}
      >
        {children}
      </div>
      <ThemeToggleButton />
      <Footer />
    </FullHeightPage>
  );
};

export default TabLayout;
