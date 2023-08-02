import { AnimatePresence, motion } from "framer-motion";
import styles from "@/styles/CommentMenu.module.scss";
import { useRef } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOuteside";
import { useDialog } from "@/context/DialogContext";
import { useCommentActions } from "@/hooks/useCommentActions";

interface Props {
  visible: boolean;
  commentId: number;
  onClose: (e?: Event) => void;
  setIsEditing: (isEdit: boolean) => void;
}

const CommentMenu = ({ visible, onClose, commentId, setIsEditing }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { useDeleteComment: deleteComment } = useCommentActions();
  useOnClickOutside(ref, (e) => {
    onClose(e);
  });
  const { open } = useDialog();
  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          className={styles.block}
          onClick={() => {
            onClose();
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          ref={ref}
        >
          <div className={styles.triangle} />
          <div className={styles.triangle_border} />
          {/* TODO: Add icon at each menu item */}
          <div
            className={styles.menu_item}
            onClick={() => {
              setIsEditing(true);
            }}
          >
            수정
          </div>
          <div
            className={styles.menu_item}
            onClick={() => {
              open({
                title: "댓글 삭제",
                description: "댓글을 완전히 삭제합니다. 정말 삭제하시겠습니까?",
                confirmText: "삭제",
                onConfirm: () => {
                  console.log("댓글 삭제");
                  deleteComment(commentId);
                  // TODO: Add Spinner & Toast
                },
                mode: "confirm",
              });
            }}
          >
            삭제
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentMenu;
