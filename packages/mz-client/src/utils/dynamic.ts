import dynamic from 'next/dynamic';

const AnimatePresence = dynamic(
  () => import('framer-motion').then((mod) => mod.AnimatePresence),
  { ssr: false }
);
const MotionDiv = dynamic(
  () => import('framer-motion').then((mod) => mod.motion.div),
  {
    ssr: false,
  }
);
const LazyMotion = dynamic(
  () => import('framer-motion').then((mod) => mod.LazyMotion),
  { ssr: false }
);

const loadFeature = async () => {
  const { domAnimation } = await import('framer-motion');
  return domAnimation;
};

export { AnimatePresence, MotionDiv, LazyMotion, loadFeature };
