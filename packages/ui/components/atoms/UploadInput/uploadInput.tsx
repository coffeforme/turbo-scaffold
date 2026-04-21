import { forwardRef, type ComponentPropsWithoutRef } from "react";
import styles from "./uploadInput.module.scss";

type UploadInputProps = Omit<ComponentPropsWithoutRef<"input">, "type"> & {
  label?: string;
  helperText?: string;
};

export const UploadInput = forwardRef<HTMLInputElement, UploadInputProps>(function UploadInput(
  { className, label = "Choose files", helperText, ...props },
  ref,
) {
  const mergedClassName = className ? `${styles.input} ${className}` : styles.input;

  return (
    <label className={styles.wrap}>
      {label ? <span className={styles.label}>{label}</span> : null}
      <input {...props} className={mergedClassName} ref={ref} type="file" />
      {helperText ? <span className={styles.helper}>{helperText}</span> : null}
    </label>
  );
});
