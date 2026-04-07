import type { ComponentPropsWithoutRef } from "react";
import styles from "./input.module.scss";

type Props = ComponentPropsWithoutRef<"input">;

const choiceTypes = new Set(["checkbox", "radio"]);

export function Input({ className, type = "text", ...props }: Props) {
  const baseClass = choiceTypes.has(type) ? styles.choice : styles.input;
  const mergedClassName = className ? `${baseClass} ${className}` : baseClass;

  return <input {...props} className={mergedClassName} type={type} />;
}
