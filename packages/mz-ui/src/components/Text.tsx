import React from "react";

interface TextProps {
  children: React.ReactNode;
  color: string;
  isItalic?: "italic" | "normal";
  isUnderline?: "underline" | "none";
}

const Text = ({
  children,
  color,
  isItalic = "italic",
  isUnderline = "underline",
}: TextProps) => {
  return (
    <span style={{ color, fontStyle: isItalic, textDecoration: isUnderline }}>
      {children}
    </span>
  );
};

export default Text;
