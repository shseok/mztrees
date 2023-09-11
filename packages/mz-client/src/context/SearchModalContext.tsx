// AuthProvider와 다른 방법으로 작성

import SearchModal from "@/components/system/SearchModal";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useState,
} from "react";

// type SearchModalProps = {
//   open: boolean;
//   setOpen: Dispatch<React.SetStateAction<boolean>>;
// };

export const SearchModalStateContext = createContext<boolean | null>(null);
export const SearchModalDispatchContext = createContext<Dispatch<
  React.SetStateAction<boolean>
> | null>(null);

export const SearchModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <SearchModalStateContext.Provider value={open}>
      <SearchModalDispatchContext.Provider value={setOpen}>
        {children}
        <SearchModal open={open} setOpen={setOpen} />
      </SearchModalDispatchContext.Provider>
    </SearchModalStateContext.Provider>
  );
};

const useSearchModal = () => {
  const openModal = useContext(SearchModalStateContext);
  const setOpenModal = useContext(SearchModalDispatchContext);
  // useDebugValue(open, (open) => (open === null ? 'open has value' : 'open is null'));
  if (openModal === null || !setOpenModal) {
    throw new Error("Cannot find SearchModalProvider");
  }
  return { openModal, setOpenModal };
};

export default useSearchModal;
