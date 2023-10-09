"use client";

import GifSelector from "@/components/system/gif/GifSelector";
import React, { ReactNode, createContext, useContext, useState } from "react";

export type GifSelectorContextType = {
  open: () => void;
  visible: boolean;
};

const GifSelectorContext = createContext<GifSelectorContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function GifSelectorProvider({ children }: Props) {
  const [visible, setVisible] = useState(false);
  const open = () => {
    setVisible(true);
  };
  const close = () => {
    setVisible(false);
  };
  const value = { open, visible };
  return (
    <GifSelectorContext.Provider value={value}>
      {children}
      <GifSelector visible={visible} onClose={close} />
    </GifSelectorContext.Provider>
  );
}

export const useGifSelector = () => {
  const context = useContext(GifSelectorContext);
  if (!context) {
    throw new Error("GifSelectorProvider not found");
  }
  return context;
};
