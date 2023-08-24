import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import styles from "@/styles/OptionSelector.module.scss";

interface Props {
  visible: boolean;
  title: string;
  list: string[];
  confirmText: string;
  cancelText: string;
  onSelect(item: string): void;
  onClose(): void;
  onConfirm(): void;
  mode?: "alert" | "confirm";
}

const OptionSelector = ({
  visible,
  title,
  list,
  onClose,
  onSelect,
  onConfirm,
  confirmText,
  cancelText,
  mode = "alert",
}: Props) => {
  return (
    <Modal className="styled_modal" visible={visible}>
      <h3 className={styles.title}>{title}</h3>
      <section className={styles.listContainer}>
        <ul className={styles.list}>
          {list.map((item, index) => (
            <li
              className={styles.item}
              key={index}
              onClick={() => onSelect(item)}
              tabIndex={0}
            >
              {item}
            </li>
          ))}
        </ul>
      </section>
      <section className={styles.footer}>
        <Button onClick={onConfirm}>{confirmText}</Button>
        {mode === "confirm" && (
          <Button onClick={onClose} variant="secondary">
            {cancelText}
          </Button>
        )}
      </section>
    </Modal>
  );
};

export default OptionSelector;
