import React, { forwardRef } from "react";
import classNames from "classnames/bind";
import Link from "next/link";
import styles from "@/styles/Button.module.scss";

const cx = classNames.bind(styles);

interface ButtonProps {
  layoutmode?: "inline" | "fullWidth";
  variant?: "primary" | "secondary" | "tertiary" | "warning";
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
      layoutmode = "inline",
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
        className={cx(
          rest.className,
          layoutmode,
          variant,
          size,
          "linked_button"
        )}
        // style={rest.style}
        href={to}
        // state={{ redirect: "/" }}
        // replace={true}
      >
        {rest.children}
      </Link>
    ) : (
      <button
        ref={ref as any}
        className={cx(layoutmode, variant, size, "styled_button")}
        {...rest}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
