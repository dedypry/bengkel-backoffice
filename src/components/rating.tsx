/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState } from "react";
import { Star } from "lucide-react";
import { Typography } from "@mui/joy";

interface InteractiveRatingProps {
  initialValue?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

export const Rating = ({
  initialValue = 0,
  onChange,
  readOnly = false,
}: InteractiveRatingProps) => {
  const [hover, setHover] = useState<number | null>(null);
  const [rating, setRating] = useState(initialValue);

  const handleAction = (val: number) => {
    if (readOnly) return;
    setRating(val);
    if (onChange) onChange(val);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-0.5">
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
              className={`relative ${!readOnly ? "cursor-pointer transition-transform active:scale-90" : ""}`}
              onClick={() => handleAction(starValue)}
              onMouseEnter={() => !readOnly && setHover(starValue)}
              onMouseLeave={() => !readOnly && setHover(null)}
            >
              {/* Layer 1: Background (Empty) */}
              <Star className="text-slate-200 fill-slate-200" size={24} />

              {/* Layer 2: Fill (Kuning) */}
              <div
                className="absolute top-0 left-0 overflow-hidden transition-all duration-200"
                style={{ width: isFilled ? "100%" : `${fillPercentage}%` }}
              >
                <Star className="text-yellow-400 fill-yellow-400" size={24} />
              </div>
            </div>
          );
        })}

        <Typography
          level="title-md"
          sx={{ ml: 1, minWidth: "2rem", fontWeight: "800" }}
        >
          {hover !== null ? hover : rating.toFixed(1)}
        </Typography>
      </div>

      {!readOnly && (
        <Typography level="body-xs" sx={{ color: "text.tertiary" }}>
          Ketuk bintang untuk memberi nilai
        </Typography>
      )}
    </div>
  );
};
