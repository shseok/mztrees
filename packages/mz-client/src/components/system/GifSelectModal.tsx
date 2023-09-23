import React from "react";
import Modal from "./Modal";

interface Props {
  visible: boolean;
  onClose: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const GifSelectModal = ({ visible, onClose }: Props) => {
  return (
    <Modal visible={visible}>
      <button onClick={(e) => onClose(e)}>닫기</button>
    </Modal>
  );
};

export default GifSelectModal;
