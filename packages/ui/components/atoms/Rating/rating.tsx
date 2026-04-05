type Props = {
  value: number;
  onChange: (rating: number) => void;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
};

const starSizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

export function Rating({
  value,
  onChange,
  maxRating = 5,
  size = "md",
  disabled = false
}: Props) {
  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const rating = index + 1;
        const isActive = rating <= value;

        return (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            disabled={disabled}
            className={`
              ${starSizes[size]}
              ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-110"}
              transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded
            `}
            aria-label={`Rate ${rating} star${rating !== 1 ? "s" : ""}`}
          >
            <span className={isActive ? "text-yellow-400" : "text-gray-300"}>
              {isActive ? "★" : "☆"}
            </span>
          </button>
        );
      })}
    </div>
  );
}