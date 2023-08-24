import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { cn } from "@/utils/common";
import { ChevronLeft, ChevronRight } from "../vectors";
import styles from "@/styles/RegionCategorySelector.module.scss";
import { regionCategoryList } from "@/lib/const";

const RegionCategorySelector = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [leftArrowActive, setLeftArrowActive] = useState(false);
  const [rightArrowActive, setRightArrowActive] = useState(true);
  const swiperRef = useRef<SwiperType>();

  useEffect(() => {
    swiperRef.current?.on("reachBeginning", () => {
      setLeftArrowActive(false);
    });
    swiperRef.current?.on("reachEnd", () => {
      setRightArrowActive(false);
    });
  }, []);

  // on scroll with drag
  useEffect(() => {
    if (!swiperRef.current?.isBeginning) {
      setLeftArrowActive(true);
    }
  }, [swiperRef.current?.isBeginning]);

  useEffect(() => {
    if (!swiperRef.current?.isEnd) {
      setRightArrowActive(true);
    }
  }, [swiperRef.current?.isEnd]);

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  // on click
  const handlePrevButtonClick = () => {
    swiperRef.current?.slidePrev();
    if (!swiperRef.current?.isBeginning) {
      setRightArrowActive(true);
    }
  };
  const handleNextButtonClick = () => {
    swiperRef.current?.slideNext();
    if (!swiperRef.current?.isEnd) {
      setLeftArrowActive(true);
    }
  };

  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={30}
      slidesPerView={"auto"}
      breakpoints={{
        // when window width is >= 320px
        500: {
          slidesPerView: 6,
          spaceBetween: 30,
        },
        // when window width is >= 480px
        640: {
          slidesPerView: 7,
          spaceBetween: 30,
        },
        // when window width is >= 640px
        780: {
          slidesPerView: 9,
          spaceBetween: 30,
        },
        920: {
          slidesPerView: 11,
          spaceBetween: 30,
        },
        1060: {
          slidesPerView: 12,
          spaceBetween: 30,
        },
        1150: {
          slidesPerView: 13,
          spaceBetween: 30,
        },
      }}
      onBeforeInit={(swiper) => {
        swiperRef.current = swiper;
      }}
      className={styles.scroll_container}
    >
      {["전체", ...regionCategoryList].map((regionCategory, idx) => (
        <SwiperSlide key={idx}>
          <AnimatePresence initial={false}>
            <motion.div
              className={cn(
                styles.region,
                idx === activeIndex && styles.active
              )}
              initial={{ opacity: 0.5, scale: 1 }}
              animate={{
                opacity: idx === activeIndex ? 1 : 0.8,
                scale: idx === activeIndex ? 1.1 : 1,
              }}
              exit={{ opacity: 0.5, scale: 1 }}
              transition={{ duration: 0.2 }}
              onClick={() => handleClick(idx)}
            >
              {regionCategory}
            </motion.div>
          </AnimatePresence>
        </SwiperSlide>
      ))}
      <button
        className={cn(styles.left_arrow, leftArrowActive && styles.active)}
        onClick={handlePrevButtonClick}
      >
        <ChevronLeft />
      </button>
      <button
        className={cn(styles.right_arrow, rightArrowActive && styles.active)}
        onClick={handleNextButtonClick}
      >
        <ChevronRight />
      </button>
    </Swiper>
  );
};

export default RegionCategorySelector;
