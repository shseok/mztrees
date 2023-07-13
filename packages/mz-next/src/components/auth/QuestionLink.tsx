import Link from "next/link";
import React from "react";
import styles from "@/styles/QuestionLink.module.scss";
import { cn } from "@/utils/common";

interface Props {
  question: string;
  name: string;
  to: string;
  className?: string;
}

const QuestionLink = ({ question, name, to, className }: Props) => {
  return (
    <div className={cn(styles.block, className && styles[className])}>
      {question} <Link href={to}>{name}</Link>
    </div>
  );
};

export default QuestionLink;
