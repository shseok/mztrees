"use client";

import BasicLayout from "@/components/layout/BasicLayout";
import WriteFormTemplate from "@/components/write/WriteFormTemplate";
import { useWriteContext } from "@/context/WriteContext";
import { useRouter } from "next/navigation";
import styles from "@/styles/WriteExtract.module.scss";
import Image from "next/image";
import { cn } from "@/utils/common";
import { useImageViewer } from "@/context/ImageViewerContext";

export default function EditExtract() {
  const {
    state: { form, error },
    actions,
  } = useWriteContext();
  const router = useRouter();
  const { extracted, selected } = form.thumbnail;
  const { open } = useImageViewer();
  const selectThumbnail = (url: string) => {
    open({
      url,
      onClose: () => {
        if (selected === url) {
          actions.change("thumbnail", { extracted });
        }
      },
      onConfirm: () => {
        actions.change("thumbnail", { extracted, selected: url });
      },
    });
  };

  return (
    <BasicLayout title="이미지 선택" hasBackButton>
      <WriteFormTemplate
        description="추출된 이미지 중 썸네일을 선택하세요"
        buttonText="다음"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.id) return;
          router.push(`/write/edit/${form.id}/intro`);
        }}
        hasGifButton
      >
        <div className={styles.group}>
          {extracted.length > 0 ? (
            extracted.map((imageUrl, index) => (
              <div
                className={cn([
                  styles.thumbnail,
                  selected === imageUrl && styles["active"],
                ])}
                key={index}
                onClick={() => selectThumbnail(imageUrl)}
              >
                <Image
                  src={imageUrl}
                  alt={`image-${index}`}
                  fill
                  priority
                  sizes="100vw"
                />
              </div>
            ))
          ) : (
            <div className={styles.notification}>
              썸네일이 존재하지 않으므로 기본 이미지로 대체합니다.
            </div>
          )}
          {error?.statusCode === 400 ? (
            <div className={styles.message}>{"이미지를 선택해주세요"}</div>
          ) : null}
        </div>
      </WriteFormTemplate>
    </BasicLayout>
  );
}
