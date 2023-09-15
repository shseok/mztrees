import React, { useState } from "react";
import LoadingIndicator from "../system/LoadingIndicator";
import Button from "../system/Button";
import styles from "@/styles/CommentEditor.module.scss";
import { useUser } from "@/context/UserContext";
import { useOpenLoginDialog } from "@/hooks/useOpenLoginDialog";
import { AnimatePresence, MotionDiv } from "@/utils/dynamic";
interface Props {
  mode: "write" | "edit" | "reply";
  isLoading: boolean;
  onSubmit: () => void;
  onClose?: () => void;
  text: string;
  setText: (text: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const CommentEditor = ({
  mode,
  isLoading,
  onSubmit,
  onClose,
  text,
  setText,
  inputRef,
}: Props) => {
  const [isButtonShown, setIsButtonShown] = useState(false);
  const { currentUser } = useUser();
  const openLoginDialog = useOpenLoginDialog();

  const onReset = () => {
    setIsButtonShown(false);
    onClose?.();
  };

  const handleSubmit = () => {
    onSubmit();
    onClose?.();
  };

  const onFocus = () => {
    if (!currentUser) {
      openLoginDialog("comment");
      return;
    }
  };

  const buttonText = mode === "edit" ? "수정" : "등록";

  return (
    <div className={styles.group}>
      <input
        className={styles.styled_input}
        placeholder="댓글을 입력하세요"
        onFocus={(e) => {
          setIsButtonShown(true);
        }}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        disabled={isLoading}
        ref={inputRef}
      />
      <AnimatePresence>
        {isButtonShown && (
          <MotionDiv
            className={styles.button_container}
            key="actions"
            initial={mode === "write" ? { height: 0, opacity: 0 } : false}
            animate={{ height: 36, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <Button size="small" variant="tertiary" onClick={onReset}>
              취소
            </Button>
            <Button size="small" onClick={handleSubmit} onFocus={onFocus}>
              {isLoading ? <LoadingIndicator color="white" /> : buttonText}
            </Button>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommentEditor;
