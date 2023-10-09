import { useGifSelector } from "@/context/GifSelectorContext";
import { RefObject, useEffect } from "react";

export const useScrollToTop = (
  ScrollContainterRef: RefObject<HTMLDivElement>
) => {
  const { isSelected, setIsSelected } = useGifSelector();

  useEffect(() => {
    if (isSelected && ScrollContainterRef.current) {
      ScrollContainterRef.current.scrollTop =
        ScrollContainterRef.current.scrollHeight;
    }
    return () => {
      setIsSelected(false);
    };
  }, [isSelected, setIsSelected, ScrollContainterRef]);
};
