import type { ComponentPropsWithoutRef } from "react";
import styles from "./label.module.scss";

type Props = ComponentPropsWithoutRef<"label">;

export function Label({ className, children, ...props }: Props) {
  const mergedClassName = className ? `${styles.label} ${className}` : styles.label;
  return (
    <label {...props} className={mergedClassName}>
      {children}
    </label>
  );
}
