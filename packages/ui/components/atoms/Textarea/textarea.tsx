import type { ComponentPropsWithoutRef } from "react";
import styles from "./textarea.module.scss";

type Props = ComponentPropsWithoutRef<"textarea">;

export function Textarea({ className, ...props }: Props) {
  const mergedClassName = className ? `${styles.textarea} ${className}` : styles.textarea;
  return <textarea {...props} className={mergedClassName} />;
}
