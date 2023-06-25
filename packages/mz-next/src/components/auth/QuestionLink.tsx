import Link from "next/link";
import React from "react";
import classNames from "classnames";
import styles from "@/styles/QuestionLink.module.scss";

interface Props {
  question: string;
  name: string;
  to: string;
  className?: string;
}

const QuestionLink = ({ question, name, to, className }: Props) => {
  return (
    <div className={classNames(className, styles.block)}>
      {question} <Link href={to}>{name}</Link>
    </div>
  );
};

export default QuestionLink;
