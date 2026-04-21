import type { FormEventHandler, ReactNode } from "react";
import { Button } from "../../atoms/Button/button";
import { Input } from "../../atoms/Input/input";
import { Label } from "../../atoms/Label/label";
import styles from "./loginForm.module.scss";

export interface LoginField {
  id: string;
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  disabled?: boolean;
  onChange: (value: string) => void;
}

interface LoginFormProps {
  title: string;
  description?: string;
  providerLabel?: string;
  fields: LoginField[];
  onSubmit: FormEventHandler<HTMLFormElement>;
  submitLabel: string;
  submitting?: boolean;
  disabled?: boolean;
  error?: string | null;
  successMessage?: string | null;
  children?: ReactNode;
  submitClassName?: string;
}

export function LoginForm({
  title,
  description,
  providerLabel,
  fields,
  onSubmit,
  submitLabel,
  submitting = false,
  disabled = false,
  error,
  successMessage,
  children,
  submitClassName,
}: LoginFormProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        {providerLabel ? <span className={styles.badge}>{providerLabel}</span> : null}
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>

      <form className={styles.form} onSubmit={onSubmit}>
        {fields.map((field) => (
          <div className={styles.field} key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              disabled={disabled || field.disabled || submitting}
              id={field.id}
              onChange={(event) => field.onChange(event.target.value)}
              placeholder={field.placeholder}
              required={field.required}
              type={field.type}
              value={field.value}
            />
            {field.hint ? <p className={styles.hint}>{field.hint}</p> : null}
          </div>
        ))}

        {children}

        {error ? <p className={styles.error}>{error}</p> : null}
        {successMessage ? <p className={styles.success}>{successMessage}</p> : null}

        <Button className={submitClassName} disabled={disabled || submitting} type="submit">
          {submitting ? "Working..." : submitLabel}
        </Button>
      </form>
    </section>
  );
}
