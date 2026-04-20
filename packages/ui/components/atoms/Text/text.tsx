import type { ComponentPropsWithoutRef } from "react";
import styles from "./text.module.scss";

type TextElement = "p" | "span" | "strong" | "small" | "div";
type TextTone = "default" | "muted" | "success" | "danger";
type TextSize = "sm" | "md" | "lg";
type TextWeight = "regular" | "medium" | "strong";

interface TextProps extends ComponentPropsWithoutRef<"p"> {
  as?: TextElement;
  tone?: TextTone;
  size?: TextSize;
  weight?: TextWeight;
}

const toneClassMap: Record<TextTone, string> = {
  default: styles.default,
  muted: styles.muted,
  success: styles.success,
  danger: styles.danger,
};

const sizeClassMap: Record<TextSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

const weightClassMap: Record<TextWeight, string> = {
  regular: styles.regular,
  medium: styles.medium,
  strong: styles.strong,
};

export function Text({
  as = "p",
  className,
  tone = "default",
  size = "md",
  weight = "regular",
  children,
  ...props
}: TextProps) {
  const Component = as;
  const mergedClassName = [
    styles.text,
    toneClassMap[tone],
    sizeClassMap[size],
    weightClassMap[weight],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component {...props} className={mergedClassName}>
      {children}
    </Component>
  );
}
