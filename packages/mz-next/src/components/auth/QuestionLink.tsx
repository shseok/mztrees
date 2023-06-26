import Link from "next/link";
import React from "react";
import classNames from "classnames/bind";
import styles from "@/styles/QuestionLink.module.scss";

const cx = classNames.bind(styles);

interface Props {
  question: string;
  name: string;
  to: string;
  className?: string;
}

const QuestionLink = ({ question, name, to, className }: Props) => {
  return (
    <div className={cx(className, "block")}>
      {question} <Link href={to}>{name}</Link>
    </div>
  );
};

export default QuestionLink;
