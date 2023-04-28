import { createContext, useContext, useMemo, useState } from 'react';

interface WriteContextState {
  url: string;
}

interface WriteContextActions {
  setUrl(url: string): void;
  reset(): void;
}

interface WriteContextType {
  state: WriteContextState;
  actions: WriteContextActions;
}

const WriteContext = createContext<WriteContextType | null>(null);

interface Props {
  children: React.ReactNode;
}

export const WriteProvider = ({ children }: Props) => {
  const [state, setState] = useState<WriteContextState>({
    url: '',
  });

  const actions = useMemo(() => {
    return {
      setUrl(url: string) {
        setState((prev) => ({
          ...prev,
          url,
        }));
      },
      reset() {
        setState({
          url: '',
        });
      },
    };
  }, []);

  const value = useMemo(() => ({ state, actions }), [state, actions]);

  return <WriteContext.Provider value={value}>{children}</WriteContext.Provider>;
};

export const useWriteContext = () => {
  const context = useContext(WriteContext);

  if (!context) {
    throw new Error('useWriteContext must be used within a WriteProvider');
  }

  return context;
};
