import type { PropsWithChildren, ReactNode } from "react";
import styles from "./card.module.scss";

interface CardProps extends PropsWithChildren {
  title?: string;
  eyebrow?: string;
  description?: string;
  footer?: ReactNode;
}

export function Card({ title, eyebrow, description, footer, children }: CardProps) {
  return (
    <section className={styles.card}>
      {title || eyebrow || description ? (
        <header className={styles.header}>
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          {title ? <h3 className={styles.title}>{title}</h3> : null}
          {description ? <p className={styles.description}>{description}</p> : null}
        </header>
      ) : null}

      <div className={styles.body}>{children}</div>

      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </section>
  );
}
