import dynamic from "next/dynamic";

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
);
const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  {
    ssr: false,
  }
);
const LazyMotion = dynamic(
  () => import("framer-motion").then((mod) => mod.LazyMotion),
  { ssr: false }
);

const loadFeature = () => import("./framerFeatures").then((res) => res.default);

export { AnimatePresence, MotionDiv, LazyMotion, loadFeature };
