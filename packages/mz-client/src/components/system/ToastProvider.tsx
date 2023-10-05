"use client";

import { FC, ReactNode } from "react";
import { Toaster } from "sonner";

interface ToastProvidersProps {
  children: ReactNode;
}

const ToastProviders: FC<ToastProvidersProps> = ({ children }) => {
  return (
    <>
      <Toaster position="top-center" richColors />
      {children}
    </>
  );
};

export default ToastProviders;
