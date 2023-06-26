import React from "react";
import BottomSheetModal from "./BottomSheetModal";
import { useBottomSheetModalStore } from "@/hooks/stores/useBottomSheetModalStore";

const GlobalBottomSheetModal = () => {
  const { items, visible, close } = useBottomSheetModalStore();
  return <BottomSheetModal visible={visible} items={items} onClose={close} />;
};

export default GlobalBottomSheetModal;
