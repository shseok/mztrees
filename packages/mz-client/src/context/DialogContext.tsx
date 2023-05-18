import { createContext, useCallback, useContext, useState } from 'react';
import Dialog from '~/components/system/Dialog';

interface DialogContextValue {
  open(config: DialogConfig): void;
  // close?
}

interface DialogConfig {
  title: string;
  description: string;
  confirmText?: string;
  onClose?(): void;
  onConfirm?(): void;
  mode?: 'alert' | 'confirm';
}

const DiaLogContext = createContext<DialogContextValue | null>(null);

interface Props {
  children: React.ReactNode;
}

// 나주에 state 통합시키기(객체화)
export function DialogProvider({ children }: Props) {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<DialogConfig | null>(null);
  const open = useCallback((config: DialogConfig) => {
    setVisible(true);
    setConfig(config);
  }, []);
  const close = useCallback(() => {
    config?.onClose?.();
    setVisible(false);
  }, [config]);
  const confirm = useCallback(() => {
    config?.onConfirm?.();
    setVisible(false);
  }, [config]);
  const value = { open };
  return (
    <DiaLogContext.Provider value={value}>
      {children}
      <Dialog
        visible={visible}
        title={config?.title ?? ''}
        description={config?.description ?? ''}
        confirmText={config?.confirmText ?? '확인'}
        onClose={close}
        onConfirm={confirm}
        mode={config?.mode ?? 'alert'}
      />
    </DiaLogContext.Provider>
  );
}

export const useDialog = () => {
  const context = useContext(DiaLogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
