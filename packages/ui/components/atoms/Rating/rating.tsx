import styles from "./rating.module.scss";

type Props = {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

const starSizes = {
  sm: styles.starSm,
  md: styles.starMd,
  lg: styles.starLg,
};

export function Rating({
  value,
  onChange,
  maxRating = 5,
  size = "md",
  disabled = false,
}: Props) {
  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  return (
    <div className={styles.rating}>
      {Array.from({ length: maxRating }, (_, index) => {
        const rating = index + 1;
        const isActive = rating <= value;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            disabled={disabled}
            className={[styles.star, starSizes[size], disabled ? styles.disabled : ""].join(" ").trim()}
            aria-label={`Rate ${rating} star${rating !== 1 ? "s" : ""}`}
          >
            <span aria-hidden="true" className={isActive ? styles.active : styles.inactive}>
              {isActive ? "\u2605" : "\u2606"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
