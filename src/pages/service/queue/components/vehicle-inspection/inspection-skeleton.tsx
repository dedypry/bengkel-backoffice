import { Skeleton } from "@heroui/react";

export default function InspectionPreviewSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-44 w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-2">
        <Skeleton className="h-3 rounded-md" />
        <Skeleton className="h-3 rounded-md" />
        <Skeleton className="h-3 rounded-md" />
      </div>
    </div>
  );
}
