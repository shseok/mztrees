import type { Item, ListMode } from '@/types/db';
import LinkCard from './LinkCard';
import styles from '@/styles/LinkCardList.module.scss';
import {
  AnimatePresence,
  LazyMotion,
  MotionDiv,
  loadFeature,
} from '@/utils/dynamic';

interface Props {
  items: Item[];
  listMode?: ListMode;
}

const LinkCardList = ({ items, listMode }: Props) => {
  return (
    <AnimatePresence mode='wait'>
      <LazyMotion features={loadFeature}>
        <MotionDiv
          key={listMode}
          initial='initialState'
          animate='animateState'
          exit='exitState'
          transition={{
            type: 'tween',
            duration: 0.35,
          }}
          variants={{
            initialState: {
              opacity: 0,
              y: 20,
            },
            animateState: {
              opacity: 1,
              y: 0,
            },
            exitState: {
              opacity: 0,
              y: -20,
            },
          }}
          className={styles.list} // Feel free to add your classes here
        >
          {items.map((item) => (
            <LinkCard key={item.id} item={item} />
          ))}
        </MotionDiv>
      </LazyMotion>
    </AnimatePresence>
  );
};

export default LinkCardList;
