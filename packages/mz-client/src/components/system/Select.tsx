"use client";

import { Variants, motion } from "framer-motion";
import React, { useState } from "react";
import styles from "@/styles/Select.module.scss";
import { ChevronDown } from "../vectors";
import { cn } from "@/utils/common";

interface Props {
  list: string[];
}

const itemVariants: Variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};

const Select = ({ list }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className={styles.menu}
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(!isOpen)}
        className={styles.button}
      >
        지역
        <motion.div
          variants={{
            open: { rotate: 180 },
            closed: { rotate: 0 },
          }}
          transition={{ duration: 0.2 }}
          style={{ originY: 0.55 }}
          className={styles.imgWrapper}
        >
          <ChevronDown />
        </motion.div>
      </motion.button>
      <motion.ul
        variants={{
          open: {
            clipPath: "inset(0% 0% 0% 0% round 10px)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.3,
              staggerChildren: 0.05,
            },
          },
          closed: {
            clipPath: "inset(10% 50% 90% 50% round 10px)",
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.3,
            },
          },
        }}
        className={cn(styles.selectList, isOpen && styles.active)}
      >
        {list.map((item, index) => {
          if (index === 0) return null;
          return (
            <motion.li
              className={styles.item}
              key={index}
              variants={itemVariants}
              onClick={() => setIsOpen(!isOpen)}
            >
              {item}
            </motion.li>
          );
        })}
      </motion.ul>
    </motion.nav>
  );
};

export default Select;
