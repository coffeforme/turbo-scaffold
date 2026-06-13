import { useState, type CSSProperties, type ReactNode } from "react";
import styles from "./flipContainer.module.scss";

interface FlipContainerProps {
  title: string;
  description?: string;
  frontLabel?: string;
  backLabel?: string;
  front: ReactNode;
  back: ReactNode;
  className?: string;
  minHeight?: number | string;
  heightMode?: "largest-face" | "active-face";
}

export function FlipContainer({
  title,
  description,
  frontLabel = "Preview",
  backLabel = "Implementation",
  front,
  back,
  className,
  minHeight,
  heightMode = "largest-face",
}: FlipContainerProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const shellClassName = className ? `${styles.shell} ${className}` : styles.shell;
  const innerClassName = [
    styles.inner,
    heightMode === "active-face" ? styles.innerActiveHeight : "",
  ]
    .filter(Boolean)
    .join(" ");

  const shellStyle =
    minHeight === undefined
      ? undefined
      : ({
          "--flip-min-height": typeof minHeight === "number" ? `${minHeight}px` : minHeight,
        } as CSSProperties);

  return (
    <section className={shellClassName} style={shellStyle}>
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
        <div className={innerClassName}>
          <div className={`${styles.face} ${isFlipped ? styles.faceHidden : styles.faceActive}`}>
            <span className={styles.faceBadge}>{frontLabel}</span>
            <div className={styles.faceContent}>{front}</div>
          </div>
          <div className={`${styles.face} ${styles.back} ${isFlipped ? styles.faceActive : styles.faceHidden}`}>
            <span className={styles.faceBadge}>{backLabel}</span>
            <div className={styles.faceContent}>{back}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
