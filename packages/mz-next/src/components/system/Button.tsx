import React, { forwardRef } from "react";
import classNames from "classnames";
import Link from "next/link";
import styles from "@/styles/Button.module.scss";

interface ButtonProps {
  layoutmode?: "inline" | "fullWidth";
  variant?: "primary" | "secondary" | "tertiary";
  size?: "small" | "medium";
}

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonProps {
  to?: string;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      layoutmode: layoutmode = "inline",
      variant = "primary",
      size = "medium",
      to,
      ...rest
    }: Props,
    ref
  ) => {
    return to ? (
      <Link
        ref={ref as any}
        children={rest.children}
        className={classNames(
          rest.className,
          layoutmode,
          variant,
          size,
          styles.linked_button
        )}
        // style={rest.style}
        href={to}
        // state={{ redirect: "/" }}
        // replace={true}
      />
    ) : (
      <button
        ref={ref as any}
        className={classNames(layoutmode, variant, size, styles.styled_button)}
        {...rest}
      />
    );
  }
);

export default Button;
