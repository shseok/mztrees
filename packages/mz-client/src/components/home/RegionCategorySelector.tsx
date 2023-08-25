"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { cn } from "@/utils/common";
import { ChevronLeft, ChevronRight } from "../vectors";
import styles from "@/styles/RegionCategorySelector.module.scss";
import { regionCategoryList } from "@/lib/const";

const RegionCategorySelector = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [swiperLoaded, setSwiperLoaded] = useState(false);
  const navigationPrevRef = useRef<HTMLButtonElement | null>(null);
  const navigationNextRef = useRef<HTMLButtonElement | null>(null);
  // SwiperCore.use([Navigation]);
  const swiperRef = useRef<SwiperCore>();

  const handleClick = (index: number) => {
    setActiveIndex(index);
  };

  const renderSlides = () => {
    if (swiperLoaded) {
      return (
        <>
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
        </>
      );
    }

    return null;
  };

  return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={20}
      navigation={{
        // apply prev, next button
        prevEl: navigationPrevRef.current,
        nextEl: navigationNextRef.current,
      }}
      slidesPerView={5}
      breakpoints={{
        // when window width is >= 500px
        500: {
          slidesPerView: 7,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 8,
          spaceBetween: 20,
        },
        780: {
          slidesPerView: 10,
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
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        // 수정: override prevnavigation props에 useRef를 미리 넣어주는 것이 아니라, 클라이언트 사이드에서 js가 로드되고 useRef가 정의되면 navigation을 생성
        if (swiper.params.navigation) {
          if (
            swiper.params.navigation &&
            typeof swiper.params.navigation !== "boolean"
          ) {
            swiper.params.navigation.prevEl = navigationPrevRef.current;
            swiper.params.navigation.nextEl = navigationNextRef.current;
          }
        }
        swiper.navigation.destroy();
        swiper.navigation.init();
        swiper.navigation.update();
        // js로드가 끝나면 렌더링
        swiper.on("reachBeginning", (swiper) => {
          console.log("begin");
          swiper.navigation.prevEl.style.display = "none";
          swiper.navigation.nextEl.style.display = "flex";
        });
        swiper.on("reachEnd", (swiper) => {
          console.log("end");
          swiper.navigation.nextEl.style.display = "none";
          swiper.navigation.prevEl.style.display = "flex";
        });
        swiper.on("scroll", (swiper) => {});
        setSwiperLoaded(true);
      }}
      className={styles.scroll_container}
    >
      {renderSlides()}
      <button ref={navigationPrevRef} className={styles.left_arrow}>
        <ChevronLeft />
      </button>
      <button ref={navigationNextRef} className={styles.right_arrow}>
        <ChevronRight />
      </button>
    </Swiper>
  );
};

export default RegionCategorySelector;
