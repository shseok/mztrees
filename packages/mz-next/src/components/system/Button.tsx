import React, { forwardRef } from "react";
import Link from "next/link";
import styles from "@/styles/Button.module.scss";
import { cn } from "@/utils/common";

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
        className={cn(
          rest.className,
          styles.linked_button,
          styles[layoutmode],
          styles[variant],
          styles[size]
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
        className={cn(
          styles.styled_button,
          styles[layoutmode],
          styles[variant],
          styles[size]
        )}
        {...rest}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
