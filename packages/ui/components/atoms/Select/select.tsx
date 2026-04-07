import type { ComponentPropsWithoutRef } from "react";
import styles from "./select.module.scss";

type Props = ComponentPropsWithoutRef<"select">;

export function Select({ className, children, ...props }: Props) {
  const mergedClassName = className ? `${styles.select} ${className}` : styles.select;
  return (
    <select {...props} className={mergedClassName}>
      {children}
    </select>
  );
}
