import { AlertTriangle } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface PackageWarningProps {
  stock: number;
  minStock: number;
  className?: string;
}

export function PackageWarning({
  stock,
  minStock,
  className,
}: PackageWarningProps) {
  // Hanya tampilkan jika stok kurang dari atau sama dengan stok minimum
  if (stock > minStock) return null;

  const isOutOfStock = stock === 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "flex items-center justify-center cursor-help transition-all hover:scale-110",
              isOutOfStock ? "text-destructive" : "text-amber-500",
              className,
            )}
          >
            <AlertTriangle className={cn("size-4 animate-pulse")} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px] text-center" side="top">
          <p className="font-semibold">
            {isOutOfStock ? "Stok Habis!" : "Stok Menipis!"}
          </p>
          <p className="text-xs opacity-90">
            {isOutOfStock
              ? "Segera lakukan pemesanan ulang."
              : `Stok saat ini (${stock}) berada di bawah batas minimum (${minStock}).`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
