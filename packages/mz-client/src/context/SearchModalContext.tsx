// AuthProvider와 다른 방법으로 작성

import SearchModal from '@/components/system/Modal/SearchModal';
import React, {
  createContext,
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

// type SearchModalProps = {
//   open: boolean;
//   setOpen: Dispatch<React.SetStateAction<boolean>>;
// };

export const SearchModalStateContext = createContext<boolean | null>(null);
export const SearchModalDispatchContext = createContext<Dispatch<
  React.SetStateAction<boolean>
> | null>(null);

export const SearchModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => {
    if (!document.startViewTransition) {
      setIsOpen(false);
    } else {
      return document.startViewTransition(() => {
        setIsOpen(false);
      });
    }
  }, []);

  return (
    <SearchModalStateContext.Provider value={isOpen}>
      <SearchModalDispatchContext.Provider value={setIsOpen}>
        {children}
        <SearchModal isOpen={isOpen} setIsOpen={setIsOpen} close={close} />
      </SearchModalDispatchContext.Provider>
    </SearchModalStateContext.Provider>
  );
};

const useSearchModal = () => {
  const openModal = useContext(SearchModalStateContext);
  const setOpenModal = useContext(SearchModalDispatchContext);
  // useDebugValue(open, (open) => (open === null ? 'open has value' : 'open is null'));
  if (openModal === null || !setOpenModal) {
    throw new Error('Cannot find SearchModalProvider');
  }
  return { openModal, setOpenModal };
};

export default useSearchModal;
