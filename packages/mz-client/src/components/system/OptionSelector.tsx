import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import styles from "@/styles/OptionSelector.module.scss";
import { Tag, TagList } from "@/types/db";
import { cn } from "@/utils/common";

interface Props {
  visible: boolean;
  title: string;
  list: string[];
  confirmText: string;
  cancelText: string;
  selected: TagList;
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
  selected,
  confirmText,
  cancelText,
  mode = "alert",
}: Props) => {
  return (
    <Modal className="styled_modal" visible={visible}>
      <h3 className={styles.title}>{title}</h3>
      <section className={styles.listContainer}>
        {list.map((item, index) => (
          <button
            className={cn(
              styles.item,
              selected.includes(item as Tag) && styles.selected
            )}
            key={index}
            onClick={() => onSelect(item)}
            tabIndex={0}
          >
            # {item}
          </button>
        ))}
      </section>
      <section className={styles.footer}>
        <Button onClick={onConfirm} type="button" size="large">
          {confirmText}
        </Button>
        {mode === "confirm" && (
          <Button
            onClick={onClose}
            variant="secondary"
            type="button"
            size="large"
          >
            {cancelText}
          </Button>
        )}
      </section>
    </Modal>
  );
};

export default OptionSelector;
