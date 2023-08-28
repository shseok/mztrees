import React, { forwardRef } from "react";
import Link from "next/link";
import styles from "@/styles/Button.module.scss";
import { cn } from "@/utils/common";
import { useTheme } from "@/context/ThemeContext";

interface ButtonProps {
  layoutmode?: "inline" | "fullWidth";
  variant?: "primary" | "secondary" | "tertiary" | "visit" | "warning";
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
          rest.className && styles[rest.className],
          styles.linked_button,
          styles[layoutmode],
          styles[variant],
          styles[size]
          // mode === "dark" && styles.dark
        )}
        // style={rest.style}
        href={to}
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
          // mode === "dark" && styles.dark
        )}
        {...rest}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
