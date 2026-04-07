import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.scss";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, className, type = "button", ...props }: Props) {
  const mergedClassName = className ? `${styles.button} ${className}` : styles.button;

  return (
    <button {...props} className={mergedClassName} type={type}>
      {children}
    </button>
  );
}
