import { Skeleton } from "@heroui/react";

export function LogsTableSkeleton({ columns = 7 }: { columns?: number }) {
  return (
    <div className="space-y-0 p-2">
      <div className="flex gap-3 border-b border-secondary-100 bg-secondary-50 px-4 py-3">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4 flex-1 rounded-sm" />
        ))}
      </div>
      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex items-center gap-3 border-b border-secondary-100 px-4 py-4 last:border-none"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 flex-1 rounded-sm" />
          ))}
        </div>
      ))}
    </div>
  );
}
