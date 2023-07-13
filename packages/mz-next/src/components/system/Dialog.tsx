import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import styles from "@/styles/Dialog.module.scss";

interface Props {
  visible: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onClose(): void;
  onConfirm(): void;
  mode?: "alert" | "confirm";
}

const Dialog = ({
  visible,
  title,
  description,
  onClose,
  onConfirm,
  confirmText,
  cancelText,
  mode = "alert",
}: Props) => {
  return (
    <Modal className="styled_modal" visible={visible}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <section className={styles.footer}>
        {mode === "confirm" && (
          <Button onClick={onClose} variant="secondary">
            {cancelText}
          </Button>
        )}
        <Button onClick={onConfirm}>{confirmText}</Button>
      </section>
    </Modal>
  );
};

export default Dialog;
