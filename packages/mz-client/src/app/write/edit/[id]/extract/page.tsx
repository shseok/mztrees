"use client";

import WriteFormTemplate from "@/components/write/WriteFormTemplate";
import { useWriteContext } from "@/context/WriteContext";
import { useRouter } from "next/navigation";
import styles from "@/styles/WriteExtract.module.scss";
import Image from "next/image";
import { cn } from "@/utils/common";
import { useImageViewer } from "@/context/ImageViewerContext";
import { useEffect, useRef } from "react";
import { useGifSelector } from "@/context/GifSelectorContext";
import DesktopHeader from "@/components/base/DesktopHeader";
import HeaderBackButton from "@/components/base/HeaderBackButton";
import MobileHeader from "@/components/base/MobileHeader";
import FullHeightPage from "@/components/system/FullHeightPage";

export default function EditExtract() {
  const {
    state: { form, error },
    actions,
  } = useWriteContext();
  const { visible } = useGifSelector();
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

  const ScrollContainterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!visible && form.thumbnail.selected) {
      if (ScrollContainterRef.current) {
        ScrollContainterRef.current.scrollTop =
          ScrollContainterRef.current.scrollHeight;
      }
    }
  }, [visible]);

  return (
    <FullHeightPage>
      <MobileHeader
        title={"이미지 선택"}
        headerLeft={<HeaderBackButton />}
        headerRight={false}
      />
      <DesktopHeader />
      <div className={styles.content} ref={ScrollContainterRef}>
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
      </div>
    </FullHeightPage>
  );
}
