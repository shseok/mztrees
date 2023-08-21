"use client";

import ImageViewer from "@/components/system/ImageViewer";
import { createContext, useCallback, useContext, useState } from "react";

interface ImageViewerConfig {
  open(config: DialogConfig): void;
}

interface DialogConfig {
  url: string;
  onClose?(): void;
  onConfirm?(): void;
}

interface Props {
  children: React.ReactNode;
}

const ImageViewerContext = createContext<ImageViewerConfig | null>(null);

export function ImageViewerProvider({ children }: Props) {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<DialogConfig | null>(null);

  const open = useCallback((config: DialogConfig) => {
    setConfig(config);
    setVisible(true);
  }, []);

  function close() {
    config?.onClose?.();
    setVisible(false);
  }

  function confirm() {
    config?.onConfirm?.();
    setVisible(false);
  }

  return (
    <ImageViewerContext.Provider value={{ open }}>
      {children}
      <ImageViewer
        visible={visible}
        url={config?.url}
        onClose={close}
        onConfirm={confirm}
      />
    </ImageViewerContext.Provider>
  );
}

export function useImageViewer() {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error("useImageViewer must be used within a ImageViewerProvider");
  }
  return context;
}
