import { Tag, TagList } from "@/types/db";
import styles from "@/styles/TagInput.module.scss";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils/common";
import { useState } from "react";
import Button from "./Button";
import OptionSelector from "./OptionSelector";
import { useWriteContext } from "@/context/WriteContext";
import { tagList } from "@/lib/const";

const TagInput = () => {
  const {
    actions,
    state: {
      form: { tags },
    },
  } = useWriteContext();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<TagList>(tags);
  const { mode } = useTheme();

  const onFocus = () => {
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
  };

  const openTagSelector = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setVisible(true);
    onFocus();
  };
  return (
    <>
      <div className={styles.block}>
        <div className={styles.top_wrapper}>
          <label
            className={cn(
              styles.label,
              focused && styles.focused,
              mode === "dark" && styles.dark
            )}
          >
            태그
          </label>
          <Button
            variant="tertiary"
            size="small"
            style={{ paddingLeft: "6px", paddingRight: "6px" }}
            onClick={openTagSelector}
          >
            + 태그 추가
          </Button>
        </div>
        <div className={styles.bottom_wrapper}>
          {tags.length > 0 ? (
            <div className={styles.tag_wrappper}>
              {tags.map((tag, index) => (
                <button className={styles.item} key={index}>
                  # {tag}
                </button>
              ))}
            </div>
          ) : (
            <span className={styles.placeholder}>태그를 입력해주세요.</span>
          )}
        </div>
      </div>
      <OptionSelector
        title="추가할 태그를 선택해주세요."
        list={[...tagList]}
        visible={visible}
        selected={selectedTags}
        onSelect={(
          e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
          value: Tag
        ) => {
          e.preventDefault();
          if (selectedTags.includes(value)) {
            setSelectedTags(selectedTags.filter((tag) => tag !== value));
          } else {
            setSelectedTags([...selectedTags, value]);
          }
        }}
        onConfirm={() => {
          if (!selectedTags.length) {
            alert("태그를 한 개 이상 선택해주세요.");
            return;
          }
          actions.change("tags", selectedTags);
          setVisible(false);
          onBlur();
          // buttonRef.current?.focus();
        }}
        onClose={() => {
          setVisible(false);
          onBlur();
        }}
        confirmText="선택"
        cancelText="취소"
        mode="confirm"
      />
    </>
  );
};

export default TagInput;
