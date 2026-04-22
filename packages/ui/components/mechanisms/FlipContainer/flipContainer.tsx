import { useState, type ReactNode } from "react";
import styles from "./flipContainer.module.scss";

interface FlipContainerProps {
  title: string;
  description?: string;
  frontLabel?: string;
  backLabel?: string;
  front: ReactNode;
  back: ReactNode;
}

export function FlipContainer({
  title,
  description,
  frontLabel = "Preview",
  backLabel = "Implementation",
  front,
  back,
}: FlipContainerProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <section className={styles.shell}>
      <button
        aria-label={isFlipped ? `Show ${frontLabel}` : `Show ${backLabel}`}
        className={`${styles.toggle} ${isFlipped ? styles.toggleActive : ""}`}
        onClick={() => setIsFlipped((current) => !current)}
        title={isFlipped ? `Show ${frontLabel}` : `Show ${backLabel}`}
        type="button"
      >
        <svg aria-hidden="true" className={styles.toggleIcon} viewBox="0 0 24 24">
          <rect className={isFlipped ? styles.outlineRect : styles.activeRect} height="10" rx="2" width="10" x="5" y="5" />
          <rect className={isFlipped ? styles.activeRect : styles.outlineRect} height="10" rx="2" width="10" x="9" y="9" />
        </svg>
      </button>

      <div className={styles.header}>
        <div className={styles.copy}>
          <h2 className={styles.title}>{title}</h2>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
      </div>

      <div className={styles.viewport}>
        <div className={`${styles.inner} ${isFlipped ? styles.flipped : ""}`}>
          <div className={styles.face}>
            <span className={styles.faceBadge}>{frontLabel}</span>
            {front}
          </div>
          <div className={`${styles.face} ${styles.back}`}>
            <span className={styles.faceBadge}>{backLabel}</span>
            {back}
          </div>
        </div>
      </div>
    </section>
  );
}
