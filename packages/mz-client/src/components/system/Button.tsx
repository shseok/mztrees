import React, { forwardRef } from "react";
import Link from "next/link";
import styles from "@/styles/Button.module.scss";
import { cn } from "@/utils/common";
import { useTheme } from "@/context/ThemeContext";

interface ButtonProps {
  layoutmode?: "inline" | "fullWidth";
  variant?: "primary" | "secondary" | "tertiary" | "visit" | "warning";
  size?: "small" | "medium" | "large";
}

interface Props
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonProps {
  to?: string;
  isBlank?: boolean;
}

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      layoutmode = "inline",
      variant = "primary",
      size = "medium",
      to,
      isBlank,
      ...rest
    }: Props,
    ref
  ) => {
    const { mode } = useTheme();
    return to ? (
      <Link
        ref={ref as any}
        className={cn(
          rest.className && styles[rest.className],
          styles.linked_button,
          styles[layoutmode],
          styles[variant],
          styles[size],
          mode === "dark" && styles.dark
        )}
        href={to}
        target={isBlank ? "_blank" : "_self"}
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
          styles[size],
          mode === "dark" && styles.dark
        )}
        {...rest}
      />
    );
  }
);

Button.displayName = "Button";

export default Button;
