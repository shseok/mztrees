// "use client";

// import { Variants, motion } from "framer-motion";
// import React, { useRef, useState } from "react";
// import styles from "@/styles/Select.module.scss";
// import { ChevronDown } from "../vectors";
// import { cn } from "@/utils/common";
// import OptionSelector from "./OptionSelector";
// import { areaList } from "@/lib/const";
// import { useWriteContext } from "@/context/WriteContext";
// import { RegionCategoryType } from "@/types/db";

// interface Props {
//   list: Array<RegionCategoryType | "지역">;
//   initialTitle: string;
// }

// const itemVariants: Variants = {
//   open: {
//     opacity: 1,
//     y: 0,
//     transition: { type: "spring", stiffness: 300, damping: 24 },
//   },
//   closed: { opacity: 0, y: 20, transition: { duration: 0.2 } },
// };

// const Select = ({ list, initialTitle }: Props) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [visible, setVisible] = useState(false);
//   const [selectedArea, setSelectedArea] = useState<string | null>(null);
//   const [selectedRegion, setSelectedRegion] =
//     useState<RegionCategoryType | null>(null);
//   const [title, setTitle] = useState(initialTitle);
//   const buttonRef = useRef<HTMLButtonElement | null>(null);
//   const { actions } = useWriteContext();

//   const handleClick = (value: RegionCategoryType) => {
//     setSelectedRegion(value);
//     setIsOpen(false);
//     // TODO: area용 모달만들고 이후 setIsOpen(!isOpen); > 닫히면, button 이름에 고정 > disable시키기
//     setVisible(true);
//   };
//   return (
//     <>
//       <motion.nav
//         initial={false}
//         animate={isOpen ? "open" : "closed"}
//         className={styles.menu}
//       >
//         <motion.button
//           whileTap={{ scale: 0.97 }}
//           onClick={(e) => {
//             e.preventDefault();
//             setIsOpen(true);
//           }}
//           className={styles.button}
//           ref={buttonRef}
//           type="button"
//         >
//           {title}
//           <motion.div
//             variants={{
//               open: { rotate: 180 },
//               closed: { rotate: 0 },
//             }}
//             transition={{ duration: 0.2 }}
//             style={{ originY: 0.55 }}
//             className={styles.imgWrapper}
//           >
//             <ChevronDown />
//           </motion.div>
//         </motion.button>
//         <motion.ul
//           variants={{
//             open: {
//               clipPath: "inset(0% 0% 0% 0% round 10px)",
//               transition: {
//                 type: "spring",
//                 bounce: 0,
//                 duration: 0.7,
//                 delayChildren: 0.3,
//                 staggerChildren: 0.05,
//               },
//             },
//             closed: {
//               clipPath: "inset(10% 50% 90% 50% round 10px)",
//               transition: {
//                 type: "spring",
//                 bounce: 0,
//                 duration: 0.3,
//               },
//             },
//           }}
//           className={cn(styles.selectList, isOpen && styles.active)}
//         >
//           {list.map((item, index) => {
//             if (index === 0) return null;
//             return (
//               <motion.li
//                 className={styles.item}
//                 key={index}
//                 variants={itemVariants}
//                 onClick={() => {
//                   if (item === "지역") {
//                     return;
//                   }
//                   handleClick(item);
//                 }}
//               >
//                 {item}
//               </motion.li>
//             );
//           })}
//         </motion.ul>
//       </motion.nav>
//       {selectedRegion && (
//         <OptionSelector
//           title="지역을 선택해주세요."
//           list={areaList[selectedRegion]}
//           visible={visible}
//           onSelect={(value: string) => {
//             setSelectedArea(value);
//           }}
//           onConfirm={() => {
//             if (!selectedArea) {
//               alert("지역을 선택해주세요.");
//               return;
//             }
//             setTitle(`${selectedRegion} - ${selectedArea}`);
//             actions.change("region", {
//               regionCategory: selectedRegion,
//               area: selectedArea,
//             });
//             setSelectedArea(null);
//             setSelectedRegion(null);
//             setVisible(false);
//             buttonRef.current?.focus();
//           }}
//           onClose={() => {
//             setVisible(false);
//           }}
//           confirmText="선택"
//           cancelText="취소"
//           mode="confirm"
//         />
//       )}
//     </>
//   );
// };

// export default Select;
