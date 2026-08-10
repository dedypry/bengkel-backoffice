/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface InteractiveRatingProps {
  initialValue?: number | string;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const normalizeRating = (value: number | string | undefined) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
};

export const Rating = ({
  initialValue = 0,
  onChange,
  readOnly = false,
}: InteractiveRatingProps) => {
  const [hover, setHover] = useState<number | null>(null);
  const [rating, setRating] = useState(() => normalizeRating(initialValue));

  useEffect(() => {
    setRating(normalizeRating(initialValue));
  }, [initialValue]);

  const handleAction = (val: number) => {
    if (readOnly) return;
    setRating(val);
    if (onChange) onChange(val);
  };

  const displayRating = hover !== null ? hover : rating;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const starValue = index + 1;

          // Logika warna: Prioritas Hover, lalu Rating, lalu Default
          const isFilled = (hover !== null ? hover : rating) >= starValue;
          const isPartiallyFilled =
            !isFilled && rating > index && rating < starValue;
          const fillPercentage = isPartiallyFilled ? (rating - index) * 100 : 0;

          return (
            <div
              key={index}
              className={`relative ${
                !readOnly
                  ? "cursor-pointer transition-transform hover:scale-110 active:scale-90"
                  : ""
              }`}
              onClick={() => handleAction(starValue)}
              onMouseEnter={() => !readOnly && setHover(starValue)}
              onMouseLeave={() => !readOnly && setHover(null)}
            >
              {/* Layer 1: Background (Empty) - Menggunakan warna default HeroUI */}
              <Star
                className="text-default-200 fill-default-200"
                size={22}
                strokeWidth={1.5}
              />

              {/* Layer 2: Fill (Warning/Kuning) */}
              <div
                className="absolute top-0 left-0 overflow-hidden transition-all duration-300 ease-soft-spring"
                style={{ width: isFilled ? "100%" : `${fillPercentage}%` }}
              >
                <Star
                  className="text-warning fill-warning"
                  size={22}
                  strokeWidth={1.5}
                />
              </div>
            </div>
          );
        })}

        {/* HeroUI-style Label */}
        <span className="ml-2 min-w-[1.5rem] text-medium font-black text-gray-700 tracking-tight">
          {displayRating.toFixed(1)}
        </span>
      </div>

      {!readOnly && (
        <p className="text-tiny text-gray-400">
          Ketuk bintang untuk memberi nilai
        </p>
      )}
    </div>
  );
};
